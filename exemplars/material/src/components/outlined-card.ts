/**
 * Local Lit stub — visually approximates Material 3 Outlined Card variant.
 * Mirrors API shape from material-web labs Card.
 */
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('md-outlined-card')
export class MdOutlinedCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--md-sys-color-surface);
      color: var(--md-sys-color-on-surface);
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-sys-shape-corner-medium);
      padding: 16px;
      font-family: var(--md-sys-typescale-body-medium-font);
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

@customElement('md-elevated-card')
export class MdElevatedCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-on-surface);
      border-radius: var(--md-sys-shape-corner-medium);
      padding: 16px;
      box-shadow: var(--md-sys-elevation-level1);
      font-family: var(--md-sys-typescale-body-medium-font);
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
