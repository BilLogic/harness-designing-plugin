/**
 * Local Lit stub — visually approximates Material 3 Filled Text Field.
 * Mirrors API shape from material-web textfield.
 */
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('md-filled-text-field')
export class MdFilledTextField extends LitElement {
  static styles = css`
    :host { display: inline-block; width: 100%; max-width: 320px; }
    .container {
      position: relative;
      background: var(--md-sys-color-surface-container-highest);
      border-bottom: 1px solid var(--md-sys-color-on-surface-variant);
      border-radius: var(--md-sys-shape-corner-extra-small) var(--md-sys-shape-corner-extra-small) 0 0;
      padding: 24px 16px 8px;
      transition: border-color 200ms;
    }
    .container:focus-within { border-bottom: 2px solid var(--md-sys-color-primary); padding-bottom: 7px; }
    label {
      position: absolute;
      top: 8px;
      left: 16px;
      font-family: var(--md-sys-typescale-body-medium-font);
      font-size: var(--md-sys-typescale-body-medium-size);
      color: var(--md-sys-color-on-surface-variant);
      pointer-events: none;
    }
    input {
      width: 100%;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--md-sys-typescale-body-large-font);
      font-size: var(--md-sys-typescale-body-large-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
      color: var(--md-sys-color-on-surface);
    }
    :host([disabled]) .container {
      opacity: 0.38;
      background: color-mix(in oklab, var(--md-sys-color-on-surface) 4%, transparent);
    }
  `;

  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Boolean }) disabled = false;

  override render() {
    return html`
      <div class="container">
        <label>${this.label}</label>
        <input .value=${this.value} ?disabled=${this.disabled} />
      </div>
    `;
  }
}
