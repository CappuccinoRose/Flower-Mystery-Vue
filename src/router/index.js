import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FlowersListView from "../views/FlowersListView.vue";
import FlowerDetailView from "../views/FlowerDetailView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "../views/ProfileView.vue";
import GuideView from "../views/GuideView.vue";
import StoriesView from "../views/StoriesView.vue";
import StoryDetailView from "../views/StoryDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/flowers",
      name: "flowers",
      component: FlowersListView,
    },
    {
      path: "/flowers/:id",
      name: "flower-detail",
      component: FlowerDetailView,
      props: true,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { requiresAuth: true }, // 这是一个简单的元标记，表示需要登录才能访问
    },
    {
      path: "/guide",
      name: "guide",
      component: GuideView,
    },
    {
      path: "/stories",
      name: "stories",
      component: StoriesView,
    },
    {
       path: "/stories/:id",
      name: "stories-detail",
      component: StoryDetailView,
      props: true,
    }
  ],
});

export default router;
