import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <header class="app-brand" aria-label="Tasks logo">
        <div class="brand-mark" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="brand-copy">
          <span class="brand-name">Tasks</span>
          <span class="brand-tagline">Simple task tracking</span>
        </div>
      </header>

      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .app-shell {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .app-brand {
        display: inline-flex;
        align-items: center;
        gap: 0.9rem;
        width: fit-content;
      }

      .brand-mark {
        width: 3rem;
        height: 3rem;
        border-radius: 1rem;
        background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%);
        display: grid;
        place-items: center;
        gap: 0.24rem;
        padding: 0.7rem;
        box-shadow: 0 10px 24px rgba(46, 125, 50, 0.2);
      }

      .brand-mark span {
        display: block;
        width: 100%;
        height: 0.22rem;
        border-radius: 999px;
        background: #ffffff;
      }

      .brand-copy {
        display: flex;
        flex-direction: column;
      }

      .brand-name {
        font-size: 1.75rem;
        line-height: 1;
        font-weight: 700;
        letter-spacing: -0.04em;
        color: #17301a;
      }

      .brand-tagline {
        color: #5f6f61;
        font-size: 0.95rem;
      }
    `,
  ],
})
export class App {}
