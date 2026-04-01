
const state = {
  salesPrice: 35000,
  moneyDown: 5000,
  apr: 9.99,
  taxRate: 20,
  term: 60,
  vsc: 0,
  gap: 490,
  club: 0,
  maintenance: 945,
  paint: 0,
  closeMode: false,
};

const presetTerms = [60, 63, 66, 72, 75];
const maintenancePresets = [945, 1000, 1360, 1930];

function money(value){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function money2(value){
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function percent2(value){
  return Number(value).toFixed(2) + '%';
}

function clampNumber(value, min = 0, max = Infinity){
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(Math.max(min, num), max);
}

function calculatePayment(principal, apr, months){
  if (months <= 0) return 0;
  if (apr <= 0) return principal / months;
  const monthlyRate = apr / 100 / 12;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
}

function setupTermButtons(){
  const wrap = document.getElementById('termButtons');
  wrap.innerHTML = '';
  presetTerms.forEach(term => {
    const btn = document.createElement('button');
    btn.className = 'term-btn' + (state.term === term ? ' active' : '');
    btn.textContent = term + ' mo';
    btn.addEventListener('click', () => {
      state.term = term;
      document.getElementById('customTerm').value = term;
      render();
    });
    wrap.appendChild(btn);
  });
}

function setupMaintenanceButtons(){
  const wrap = document.getElementById('maintenanceButtons');
  wrap.innerHTML = '';
  maintenancePresets.forEach(value => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn' + (state.maintenance === value ? ' active' : '');
    btn.textContent = money(value);
    btn.addEventListener('click', () => {
      state.maintenance = value;
      render();
    });
    wrap.appendChild(btn);
  });
}

function bindSlider(id, key, min = 0, max = Infinity){
  const el = document.getElementById(id);
  el.addEventListener('input', e => {
    state[key] = clampNumber(e.target.value, min, max);
    if (key === 'salesPrice') {
      document.getElementById('salesPriceInput').value = state.salesPrice;
    }
    render();
  });
}

function bindInput(id, key, min = 0, max = Infinity){
  const el = document.getElementById(id);
  el.addEventListener('input', e => {
    state[key] = clampNumber(e.target.value, min, max);
    if (key === 'salesPrice') {
      document.getElementById('salesPrice').value = Math.min(state.salesPrice, Number(document.getElementById('salesPrice').max));
    }
    render();
  });
}

function render(){
  const baseAmountFinanced = Math.max(state.salesPrice - state.moneyDown, 0);
  const productsTotal = state.vsc + state.gap + state.club + state.maintenance + state.paint;
  const fullAmountFinanced = baseAmountFinanced + productsTotal;
  const baseTax = baseAmountFinanced * (state.taxRate / 100);
  const fullTax = fullAmountFinanced * (state.taxRate / 100);
  const baseNet = baseAmountFinanced - baseTax;
  const fullNet = fullAmountFinanced - fullTax;
  const monthlyPayment = calculatePayment(fullAmountFinanced, state.apr, state.term);

  document.getElementById('app').classList.toggle('close-mode', state.closeMode);

  document.getElementById('salesPrice').value = Math.min(state.salesPrice, Number(document.getElementById('salesPrice').max));
  document.getElementById('taxRate').value = state.taxRate;
  document.getElementById('vsc').value = state.vsc;
  document.getElementById('gap').value = state.gap;
  document.getElementById('club').value = state.club;
  document.getElementById('maintenance').value = state.maintenance;
  document.getElementById('paint').value = state.paint;

  document.getElementById('salesPriceInput').value = state.salesPrice;
  document.getElementById('moneyDownInput').value = state.moneyDown;
  document.getElementById('aprInput').value = state.apr.toFixed(2);
  document.getElementById('customTerm').value = state.term;

  document.getElementById('salesPriceValue').textContent = money(state.salesPrice);
  document.getElementById('moneyDownValue').textContent = money(state.moneyDown);
  document.getElementById('aprValue').textContent = percent2(state.apr);
  document.getElementById('amountFinancedValue').textContent = money(fullAmountFinanced);
  document.getElementById('taxRateValue').textContent = state.taxRate + '%';
  document.getElementById('termValue').textContent = state.term + ' months';

  document.getElementById('vscValue').textContent = money(state.vsc);
  document.getElementById('gapValue').textContent = money(state.gap);
  document.getElementById('clubValue').textContent = money(state.club);
  document.getElementById('maintenanceValue').textContent = money(state.maintenance);
  document.getElementById('paintValue').textContent = money(state.paint);

  document.getElementById('baseSalesPrice').textContent = money(state.salesPrice);
  document.getElementById('baseMoneyDown').textContent = money(state.moneyDown);
  document.getElementById('baseApr').textContent = percent2(state.apr);
  document.getElementById('baseAmountFinanced').textContent = money(baseAmountFinanced);
  document.getElementById('baseTax').textContent = money(baseTax);
  document.getElementById('baseNet').textContent = money(baseNet);

  document.getElementById('productsTotal').textContent = money(productsTotal);
  document.getElementById('fullAmountFinanced').textContent = money(fullAmountFinanced);
  document.getElementById('fullApr').textContent = percent2(state.apr);
  document.getElementById('fullTax').textContent = money(fullTax);
  document.getElementById('fullNet').textContent = money(fullNet);

  document.getElementById('monthlyImpact').textContent = money2(monthlyPayment) + ' / mo';
  document.getElementById('monthlyTerm').textContent = 'At ' + percent2(state.apr) + ' APR for ' + state.term + ' months';

  setupTermButtons();
  setupMaintenanceButtons();
}

document.getElementById('closeModeBtn').addEventListener('click', () => {
  state.closeMode = !state.closeMode;
  document.getElementById('closeModeBtn').textContent = state.closeMode ? 'Exit Close Mode' : 'Close Mode';
  render();
});

document.getElementById('moneyDownInput').addEventListener('input', e => {
  state.moneyDown = clampNumber(e.target.value, 0);
  render();
});

document.getElementById('aprInput').addEventListener('input', e => {
  state.apr = clampNumber(e.target.value, 0, 30);
  render();
});

document.getElementById('customTerm').addEventListener('input', e => {
  state.term = clampNumber(e.target.value, 1, 120);
  render();
});

bindSlider('salesPrice', 'salesPrice', 0, 100000);
bindSlider('taxRate', 'taxRate', 10, 40);
bindSlider('vsc', 'vsc', 0, 9000);
bindSlider('gap', 'gap', 490, 1295);
bindSlider('club', 'club', 0, 2420);
bindSlider('maintenance', 'maintenance', 945, 1930);
bindSlider('paint', 'paint', 0, 1288);

bindInput('salesPriceInput', 'salesPrice', 0, 100000);

render();
