<template>
  <div id="app" class="app-container">
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          <span class="brand-icon">📋</span>
          <span class="brand-text">Генератор форм</span>
        </router-link>

        <button
          class="navbar-toggle"
          :class="{ 'is-active': isMenuOpen }"
          @click="toggleMenu"
          aria-label="Меню"
          aria-expanded="isMenuOpen"
        >
          <span class="navbar-toggle__line"></span>
          <span class="navbar-toggle__line"></span>
          <span class="navbar-toggle__line"></span>
        </button>

        <ul class="navbar-menu" :class="{ 'is-open': isMenuOpen }">
          <li>
            <router-link
              to="/"
              :class="{ active: $route.name === 'home' }"
              @click="closeMenu"
            >
              Главная
            </router-link>
          </li>
          <li>
            <router-link
              to="/basic-form"
              :class="{ active: $route.name === 'basic-form' }"
              @click="closeMenu"
            >
              Базовая форма
            </router-link>
          </li>
          <li>
            <router-link
              to="/complex-form"
              :class="{ active: $route.name === 'complex-form' }"
              @click="closeMenu"
            >
              Сложная форма
            </router-link>
          </li>
          <li>
            <router-link
              to="/slot-customization"
              :class="{ active: $route.name === 'slot-customization' }"
              @click="closeMenu"
            >
              Слоты
            </router-link>
          </li>
          <li>
            <router-link
              to="/advanced"
              :class="{ active: $route.name === 'advanced' }"
              @click="closeMenu"
            >
              Продвинутое
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 Vue 3 Form Generator</p>
        <p>TypeScript + Vue 3 + Pinia + SCSS</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleResize = () => {
  if (window.innerWidth > 850 && isMenuOpen.value) {
    closeMenu()
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (isMenuOpen.value &&
    !target.closest('.navbar-menu') &&
    !target.closest('.navbar-toggle')) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background: linear-gradient(135deg, $color-primary, color.adjust($color-primary, $lightness: 5%));
  color: white;
  padding: $spacing-md 0;
  box-shadow: $shadow-md;
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  @media (max-width: 850px) {
    padding: 0 $spacing-md;
  }
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-lg;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: all $transition-duration ease;
  z-index: 2;
  white-space: nowrap;

  &:hover {
    transform: scale(1.05);
  }

  .brand-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .brand-text {
    @media (max-width: 850px) {
      display: none;
    }
  }

  @media (max-width: 650px) {
    font-size: $font-size-base;

    .brand-icon {
      font-size: 1.25rem;
    }
  }
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 2;

  @media (max-width: 650px) {
    display: flex;
  }

  .navbar-toggle__line {
    width: 100%;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &.is-active {
    .navbar-toggle__line:nth-child(1) {
      transform: translateY(10px) rotate(45deg);
    }

    .navbar-toggle__line:nth-child(2) {
      opacity: 0;
    }

    .navbar-toggle__line:nth-child(3) {
      transform: translateY(-10px) rotate(-45deg);
    }
  }
}

.navbar-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: $spacing-lg;

  @media (max-width: 1100px) {
    gap: 1rem;
  }

  @media (max-width: 950px) {
    gap: 0.5rem;
  }

  @media (max-width: 850px) {
    gap: 0.2rem;
  }

  @media (max-width: 650px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: linear-gradient(135deg, $color-primary, color.adjust($color-primary, $lightness: 5%));
    padding: $spacing-md;
    box-shadow: $shadow-md;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    &.is-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    li {
      width: 100%;
      margin: 0;
    }
  }

  a {
    display: block;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: all $transition-duration ease;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-sm;
    font-weight: 500;
    white-space: nowrap;

    @media (max-width: 950px) {
      padding: $spacing-sm $spacing-sm;
    }

    @media (max-width: 850px) {
      padding: $spacing-sm $spacing-xs;
      font-size: 0.95rem;
    }

    &:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    @media (max-width: 650px) {
      padding: $spacing-md;
      text-align: center;
      border-radius: $border-radius-sm;
      margin: 2px 0;
      font-size: $font-size-base;

      &:hover {
        background-color: rgba(255, 255, 255, 0.15);
      }
    }
  }
}

.main-content {
  flex: 1;
  padding: $spacing-xl 0 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 300px);
}

.footer {
  background: linear-gradient(135deg, $color-primary, color.adjust($color-primary, $lightness: 5%));
  color: white;
  padding: $spacing-xl;
  margin-top: auto;
  text-align: center;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;

    p {
      margin: $spacing-sm 0;
      font-size: $font-size-sm;
      font-weight: bold;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: $spacing-lg 0;
  }

  .footer {
    padding: $spacing-lg;
  }
}
</style>
