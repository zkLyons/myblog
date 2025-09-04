# pinia

## 大仓库和小仓库的区别

大仓库（Pinia 实例）和用户小仓库（Store 实例）是 Pinia 状态管理库中的两个核心概念，它们的关系可以类比为 **一个大型购物中心（大仓库）和里面的一家家独立店铺（小仓库）**。



### 大仓库（Pinia 实例）



**大仓库** 是整个应用程序 **全局状态的容器**，由 `createPinia()` 方法创建。它通常在应用程序的入口文件 (`main.js`) 中被创建一次，并被注入到 Vue 应用中。

- **唯一性**：整个应用中只有一个大仓库实例。

- **作用**：它像一个中央调度中心，负责管理所有小仓库，并提供一些全局功能，例如插件（plugins）支持。当你使用 `pinia.use()` 安装 Pinia 插件时，这些插件会作用于所有的小仓库。

- **代码示例**：

  

  ```JavaScript
  // main.js
  import { createPinia } from 'pinia';
  const pinia = createPinia(); // 创建大仓库实例
  app.use(pinia); // 注入到 Vue 应用
  ```

------



### 小仓库（Store 实例）



**小仓库** 是由 `defineStore()` 方法创建的，它包含了特定模块（如用户、购物车、设置等）的状态、计算属性和操作。每个小仓库都是 **独立的、模块化的**。

- **多重性**：你的应用程序可以有多个小仓库，每个小仓库管理一个特定功能模块的状态。

- **作用**：它封装了业务逻辑，使得代码组织清晰、易于维护。例如，`userStore` 只处理用户相关的状态和操作，`cartStore` 只处理购物车相关的。

- **代码示例**：

  

  ```JavaScript
  // store/modules/user.js
  import { defineStore } from 'pinia';
  
  export const useUserStore = defineStore('user', {
    state: () => ({
      token: 'xxx',
      name: '张三'
    }),
    actions: {
      login() {
        // ...
      }
    }
  });
  ```



### 它们的联系



虽然大仓库和小仓库在概念上是独立的，但它们之间存在一种 **父子关系**。当你通过 `const userStore = useUserStore()` 来使用一个小仓库时，Pinia 实际上是在幕后：

1. **找到大仓库实例**（通过 Vue 上下文或手动传入）。
2. **在小仓库中创建响应式状态**。
3. **将这个小仓库实例挂载到大仓库上**，使其成为全局状态的一部分。

这就像一个店铺在购物中心里开业：店铺（小仓库）是独立的，但它必须在购物中心（大仓库）这个统一的框架下运行，才能被顾客（Vue 组件）找到和访问。



### 总结



- **大仓库（Pinia 实例）**：**唯一的、全局的** 容器，负责管理所有小仓库，并提供全局功能。
- **小仓库（Store 实例）**：**多个的、模块化的** 状态管理单元，负责封装特定功能模块的业务逻辑。

这种设计使得状态管理既能保持模块化和高内聚，又能通过一个统一的入口 (`pinia`) 进行全局管理，从而大大提升了大型应用的可维护性。

-------



## vue组件内和组件外引用小仓库

在非vue组件内，例如permission.ts 文件中需要传入 `pinia` 实例，而在 Vue 组件中不需要，这通常是因为 **代码运行环境和 Pinia 的初始化时机不同**。



### 1. Vue 组件中的情况



在 Vue 组件中，Pinia 是在应用程序的入口文件（通常是 `main.js`）中，通过 `app.use(pinia)` 进行了全局注册。



```JavaScript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // 这里进行了全局注册
app.mount('#app')
```

当 Pinia 被这样全局注册后，它会把 **大仓库** 实例（也就是 `pinia`）挂载到 Vue 应用程序的上下文上。因此，当你在一个 Vue 组件的 `setup` 函数中调用 `const userStore = useUserStore()` 时，Pinia 能够自动从当前 Vue 组件实例的上下文中找到那个全局注册的 **大仓库** 实例，并把 **小仓库**（`userStore`）绑定到它上面。

```vue
//vue组件中
<script setup>
import useStore from './store/modules/user'
//这里也可以传入全局的pinia参数，但是pinia v2之后，就不是必须了，应用程序已经通过 app.use(pinia) 将 pinia 挂载到 Vue 实例上，那么 useUserStore() 函数会自动找到并使用它，你就不需要手动传入了
//let useUserStore = useStore(pinia)  
let useUserStore = useStore()
</script>
```



### 2. `permission.ts` 文件中的情况



`permission.ts` 通常是一个独立的 JavaScript/TypeScript 文件，它不在 Vue 组件的生命周期中运行。

在这种情况下，`permission.ts` 是在 `main.js` 中被 `import` 进来的，但它本身并 **不处于 Vue 应用的上下文中**。因此，当你直接在 `permission.ts` 中调用 `useUserStore()` 时，它无法像组件那样自动找到全局的 `pinia` 实例。

为了解决这个问题，你必须 **手动将大仓库 `pinia` 实例作为参数传入** 小仓库的 `useUserStore()` 函数中，明确告诉它：“嘿，请把这个小仓库绑定到我传给你的这个大仓库上。”

JavaScript

```
// permission.ts
import { createRouter, createWebHashHistory } from 'vue-router'
import pinia from './store' // 导入大仓库
import useUserStore from './store/modules/user'

const userStore = useUserStore(pinia) // 手动传入大仓库，显式绑定

// 路由守卫逻辑...
router.beforeEach(async (to, from, next) => {
  if (userStore.token) {
    // ...
  }
})
```

**总结来说，**在 Vue 组件中，你像一个“特权公民”，能自动访问到全局注册的 Pinia 大仓库；而在 `permission.ts` 中，你就像一个“外部访客”，必须通过手动传入的方式来获取访问权限。

这个差异是 Pinia 内部设计的一个细节，确保了 Pinia Store 无论在 Vue 组件内部还是外部文件（如路由守卫、异步请求拦截器等）都能正确地被实例化和使用。







