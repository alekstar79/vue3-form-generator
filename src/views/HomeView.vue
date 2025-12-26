<template>
  <div class="home-view">
    <div class="hero">
      <div class="hero-content">
        <h1>Генератор форм</h1>
        <p class="hero-subtitle">Настраиваемый генератор форм для Vue 3</p>
        <p class="hero-description">
          Создавайте сложные формы быстро с поддержкой валидации, слотов и состояния.
        </p>

        <div class="hero-buttons">
          <router-link to="/basic-form" class="btn btn--primary">
            Начать
          </router-link>
          <a href="#features" class="btn btn--secondary">
            Подробнее
          </a>
        </div>
      </div>
    </div>

    <section id="features" class="features">
      <div class="container">
        <h2>Возможности</h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Множество типов полей</h3>
            <p>Input, Select, Textarea, Checkbox и многое другое.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">✅</div>
            <h3>Встроенная валидация</h3>
            <p>Required, minLength, maxLength, pattern и пользовательские правила.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Кастомизация через слоты</h3>
            <p>Переопределите любую часть формы используя именованные слоты.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔄</div>
            <h3>Управление состоянием</h3>
            <p>Pinia store для управления состоянием нескольких форм.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📦</div>
            <h3>Переиспользуемость</h3>
            <p>Один компонент для разных форм благодаря конфигурации.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Производительность</h3>
            <p>Оптимизированный код с ленивой загрузкой и code splitting.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="examples">
      <div class="container">
        <h2>Примеры использования</h2>

        <div class="examples-grid">
          <router-link to="/basic-form" class="example-card">
            <div class="example-icon">💬</div>
            <h3>Базовая форма</h3>
            <p>Форма обратной связи с основными типами полей и валидацией.</p>
            <span class="arrow">→</span>
          </router-link>

          <router-link to="/complex-form" class="example-card">
            <div class="example-icon">🏢</div>
            <h3>Сложная форма</h3>
            <p>Многошаговая форма с условной логикой и зависимыми полями.</p>
            <span class="arrow">→</span>
          </router-link>

          <router-link to="/slot-customization" class="example-card">
            <div class="example-icon">🎭</div>
            <h3>Кастомизация</h3>
            <p>Использование слотов для полной кастомизации дизайна.</p>
            <span class="arrow">→</span>
          </router-link>

          <router-link to="/advanced" class="example-card">
            <div class="example-icon">🚀</div>
            <h3>Продвинутое</h3>
            <p>Динамические формы, асинхронная валидация и интеграция с API.</p>
            <span class="arrow">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <section class="tech-stack">
      <div class="container">
        <h2>Технологический стек</h2>

        <div class="tech-grid">
          <div class="tech-item">
            <h4>TypeScript</h4>
            <p>Полная типизация</p>
          </div>

          <div class="tech-item">
            <h4>Vue 3</h4>
            <p>Composition API & Script Setup</p>
          </div>

          <div class="tech-item">
            <h4>Vue Router</h4>
            <p>Навигация между страницами</p>
          </div>

          <div class="tech-item">
            <h4>Pinia</h4>
            <p>Управление состоянием</p>
          </div>

          <div class="tech-item">
            <h4>SCSS</h4>
            <p>Стилизация и переменные</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@use '@/styles/variables' as *;

.home-view {
  display: flex;
  flex-direction: column;
}

.hero {
  background: linear-gradient(135deg, $color-primary 0%, color.adjust($color-primary, $lightness: 15%) 100%);
  color: white;
  padding: 60px $spacing-lg;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: $font-size-xxl * 1.5;
    margin-bottom: $spacing-md;
    color: white;
  }

  .hero-subtitle {
    font-size: $font-size-lg;
    margin-bottom: $spacing-md;
    opacity: 0.95;
  }
  .hero-description {
    font-size: $font-size-base;
    margin-bottom: $spacing-xl;
    opacity: 0.9;
  }
  .hero-buttons {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
    flex-wrap: wrap;

    .btn {
      padding: $spacing-md $spacing-xl;
      font-weight: 600;
      border-radius: $border-radius;
      text-decoration: none;
      transition: all $transition-duration ease;
      display: inline-block;

      &--primary {
        background: white;
        color: $color-primary;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
      }
      &--secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid white;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.features {
  padding: 80px $spacing-lg;
  background: white;

  h2 {
    text-align: center;
    margin-bottom: 60px;
    font-size: $font-size-xl;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $spacing-xl;
  }
  .feature-card {
    padding: $spacing-lg;
    border-radius: $border-radius;
    border: 2px solid $color-border;
    transition: all $transition-duration ease;
    text-align: center;

    &:hover {
      border-color: $color-primary;
      box-shadow: $shadow-md;
      transform: translateY(-4px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: $spacing-md;
    }

    h3 {
      margin-bottom: $spacing-sm;
      color: $color-text-primary;
    }
    p {
      color: $color-text-secondary;
      margin-bottom: 0;
    }
  }
}

.examples {
  padding: 80px $spacing-lg;
  background: $color-background-alt;

  h2 {
    text-align: center;
    margin-bottom: 60px;
  }

  .examples-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-lg;
  }
  .example-card {
    flex: 0 0 250px;
    max-width: 250px;
    min-width: 250px;
    padding: $spacing-lg;
    background: white;
    border-radius: $border-radius;
    border: 2px solid $color-border;
    text-decoration: none;
    color: $color-text-primary;
    transition: all $transition-duration ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, $color-primary, $color-secondary);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform $transition-duration ease;
    }

    &:hover {
      border-color: $color-primary;
      box-shadow: $shadow-md;
      transform: translateY(-4px);

      &::before {
        transform: scaleX(1);
      }

      .arrow {
        transform: translateX(4px);
      }
    }

    .example-icon {
      font-size: 2rem;
      margin-bottom: $spacing-md;
    }

    h3 {
      margin-bottom: $spacing-sm;
      font-size: $font-size-lg;
    }
    p {
      color: $color-text-secondary;
      margin-bottom: 0;
      font-size: $font-size-sm;
    }

    .arrow {
      position: absolute;
      bottom: $spacing-md;
      right: $spacing-md;
      font-size: $font-size-xl;
      transition: transform $transition-duration ease;
    }
  }
}

.tech-stack {
  padding: 80px $spacing-lg;
  background: white;

  h2 {
    text-align: center;
    margin-bottom: 60px;
  }

  .tech-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $spacing-lg;
  }
  .tech-item {
    flex: 0 0 200px;
    max-width: 200px;
    min-width: 200px;
    padding: $spacing-lg;
    background: $color-background-alt;
    border-radius: $border-radius;
    text-align: center;

    h4 {
      margin-bottom: $spacing-sm;
      color: $color-primary;
    }

    p {
      color: $color-text-secondary;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 40px $spacing-md;

    h1 {
      font-size: $font-size-xl * 1.5;
    }
  }
  .features,
  .examples,
  .tech-stack {
    padding: 40px $spacing-md;
  }
  .hero-buttons {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }

  .example-card {
    flex: 0 0 100%;
    max-width: 400px;
  }

  .tech-item {
    flex: 0 0 calc(50% - #{$spacing-lg});
    max-width: calc(50% - #{$spacing-lg});
    min-width: 150px;
  }
}
</style>
