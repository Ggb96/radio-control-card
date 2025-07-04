
class RadioControlCard extends HTMLElement {
  setConfig(config) {
    this._config = config;
    const root = this.attachShadow({ mode: "open" });

    root.innerHTML = `
      <style>
        ha-card {
          padding: 16px;
        }
        select, input[type="range"], button {
          width: 100%;
          margin-top: 4px;
        }
        button {
          padding: 10px;
          font-weight: bold;
          border: none;
          border-radius: 10px;
        }
        .estado {
          font-weight: bold;
          color: #FFD600;
          background: #212121;
          padding: 8px;
          border-radius: 8px;
        }
        .buttons {
          display: flex;
          gap: 10px;
        }
      </style>
      <ha-card header="🎶 Controle da Rádio">
        <div>
          <label>📻 Escolha a Rádio</label>
          <select id="radio"></select>
        </div>
        <div>
          <label>🖥️ Destino de Reprodução</label>
          <select id="destino"></select>
        </div>
        <div>
          <label>🔊 Volume</label>
          <input type="range" id="volume" min="0" max="100">
        </div>
        <div class="estado">
          <ha-icon icon="mdi:speaker"></ha-icon>
          Estado Atual: <span id="estado"></span>
        </div>
        <div class="buttons">
          <button id="play" style="background:#4CAF50; color:white;">▶️ Tocar</button>
          <button id="pause" style="background:#FF9800; color:white;">⏸️ Pausar</button>
          <button id="stop" style="background:#F44336; color:white;">⏹️ Parar</button>
        </div>
      </ha-card>
    `;

    root.getElementById("play").onclick = () => this._callService(this._config.play);
    root.getElementById("pause").onclick = () => this._callService(this._config.pause);
    root.getElementById("stop").onclick = () => this._callService(this._config.stop);
  }

  set hass(hass) {
    const root = this.shadowRoot;
    const cfg = this._config;

    this._hass = hass;

    this._updateSelect(root.getElementById("radio"), hass.states[cfg.radio]);
    this._updateSelect(root.getElementById("destino"), hass.states[cfg.destino]);

    root.getElementById("volume").value = hass.states[cfg.volume].state;
    root.getElementById("estado").textContent = hass.states[cfg.estado].state;
  }

  _updateSelect(el, state) {
    if (!el || !state) return;
    el.innerHTML = "";
    state.attributes.options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.text = opt;
      if (opt === state.state) o.selected = true;
      el.appendChild(o);
    });

    el.onchange = () => {
      this._hass.callService("input_select", "select_option", {
        entity_id: state.entity_id,
        option: el.value,
      });
    };
  }

  _callService(service) {
    const [domain, action] = service.split(".");
    this._hass.callService(domain, action);
  }

  getCardSize() {
    return 3;
  }
}

customElements.define("radio-control-card", RadioControlCard);
