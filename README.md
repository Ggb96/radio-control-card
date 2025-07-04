# 🎶 Radio Control Card

Um cartão personalizado para controlar rádios no Home Assistant, com seleção de estação, destino, volume e botões de Tocar, Pausar e Parar.

## 📦 Instalação via HACS

1. Adicione este repositório como _Frontend Repository_ no HACS.
2. Instale o componente.
3. Adicione o cartão ao Lovelace com:

```yaml
type: custom:radio-control-card
radio: input_select.radios_disponiveis
destino: input_select.destino_de_reproducao
volume: input_number.volume_radio
estado: input_text.ultima_radio_selecionada
play: script.tocar_radio_dropdown
pause: script.pause_radio_dropdown
stop: script.stop_radio_dropdown
