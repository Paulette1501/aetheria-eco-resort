window.state = {
  checkIn: null,
  checkOut: null,
  guests: 2,
  nights: 1,
  selectedRoom: null,
  selectedServices: [],
  selectedSlot: '10:00 hrs',
  discount: 0,
  user: null
};

const ROOMS = [
  {
    id: 1,
    name: 'Villa Selva Tropical',
    capacity: '2 Huéspedes',
    bed: 'Cama King Size',
    price: 320,
    mainImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 2,
    name: 'Suite Overwater Esmeralda',
    capacity: '4 Huéspedes',
    bed: '2 Camas King Size',
    price: 580,
    mainImage: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const SERVICES = [
  {
    id: 101,
    name: 'Masaje Holístico Spa',
    price: 120,
    duration: '60 min',
    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 102,
    name: 'Cena Gourmet Privada',
    price: 190,
    duration: '90 min',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 103,
    name: 'Tour Snorkel y Kayak',
    price: 75,
    duration: '120 min',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 104,
    name: 'Helicóptero VIP',
    price: 350,
    duration: '45 min',
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80'
  }
];

const SLOTS = ['10:00 hrs', '11:30 hrs', '14:00 hrs', '16:30 hrs', '18:00 hrs'];

window.navTo = function(viewId) {
  const vSearch = document.getElementById('view-search');
  const vResults = document.getElementById('view-results');
  const vConfirm = document.getElementById('view-confirm');

  if (vSearch) vSearch.classList.add('hidden');
  if (vResults) vResults.classList.add('hidden');
  if (vConfirm) vConfirm.classList.add('hidden');

  const target = document.getElementById(viewId);
  if (target) target.classList.remove('hidden');
};

window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : 'bg-aetheria-jungle';
  toast.className = `${bgColor} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center space-x-3 transition-all transform translate-y-2 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 50);
  setTimeout(() => { toast.classList.add('opacity-0'); setTimeout(() => toast.remove(), 300); }, 3500);
};

window.toggleLoginModal = function() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.toggle('hidden');
};

window.loginWithGoogle = function() {
  state.user = { name: 'Huésped Google', email: 'usuario@google.com' };
  updateUserUI();
  toggleLoginModal();
  showToast('¡Sesión iniciada con Google!', 'info');
};

window.loginWithEmail = function() {
  const emailInput = document.getElementById('login-email');
  const email = emailInput ? emailInput.value : '';
  if (!email) return showToast('Ingresa tu correo', 'error');
  state.user = { name: email.split('@')[0], email };
  updateUserUI();
  toggleLoginModal();
  showToast('¡Bienvenido ' + state.user.name + '!', 'info');
};

function updateUserUI() {
  const container = document.getElementById('user-nav-container');
  if (state.user && container) {
    container.innerHTML = `
      <div class="flex items-center space-x-3 bg-emerald-800/60 px-4 py-1.5 rounded-xl text-xs font-semibold">
        <i class="fa-solid fa-user-check text-aetheria-gold"></i>
        <span>${state.user.name}</span>
      </div>
    `;
  }
}

window.handleSearch = function() {
  const checkInElem = document.getElementById('checkin');
  const checkOutElem = document.getElementById('checkout');
  const guestsElem = document.getElementById('guests');

  if (!checkInElem || !checkOutElem || !guestsElem) {
    return showToast('No se encontraron los campos del formulario.', 'error');
  }

  const checkIn = checkInElem.value;
  const checkOut = checkOutElem.value;
  const guests = parseInt(guestsElem.value) || 1;

  if (!checkIn || !checkOut) return showToast('Selecciona fechas válidas.', 'error');

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0,0,0,0);

  if (inDate < today) return showToast('Fecha en el pasado no válida.', 'error');
  if (outDate <= inDate) return showToast('La salida debe ser posterior a la llegada.', 'error');

  state.checkIn = checkIn;
  state.checkOut = checkOut;
  state.guests = guests;
  state.nights = Math.ceil(Math.abs(outDate - inDate) / (1000 * 60 * 60 * 24));

  const summaryElem = document.getElementById('search-summary');
  if (summaryElem) {
    summaryElem.innerText = `${state.nights} noche(s) | ${guests} huésped(es) (${checkIn} al ${checkOut})`;
  }

  renderVillas();
  renderServices();
  renderSlots();
  navTo('view-results');
};

function renderVillas() {
  const container = document.getElementById('villas-container');
  if (!container) return;

  container.innerHTML = ROOMS.map(r => `
    <div onclick="selectVilla(${r.id})" id="villa-card-${r.id}" class="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-aetheria-jungle shadow-md cursor-pointer transition transform hover:-translate-y-1">
      <img src="${r.mainImage}" class="h-48 w-full object-cover">
      <div class="p-5">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-bold text-lg text-aetheria-emerald">${r.name}</h4>
          <span class="bg-emerald-100 text-aetheria-jungle font-bold text-xs px-2.5 py-1 rounded-full">$${r.price}/noche</span>
        </div>
        <p class="text-xs text-gray-500 mb-3"><i class="fa-solid fa-users mr-1"></i> ${r.capacity} · <i class="fa-solid fa-bed mr-1"></i> ${r.bed}</p>
        <div class="grid grid-cols-3 gap-1">
          ${r.gallery.map(img => `<img src="${img}" class="h-14 w-full object-cover rounded-lg">`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  selectVilla(1);
}

window.selectVilla = function(id) {
  state.selectedRoom = ROOMS.find(r => r.id === id);
  ROOMS.forEach(r => {
    const card = document.getElementById(`villa-card-${r.id}`);
    if (card) {
      if (r.id === id) {
        card.classList.add('border-aetheria-jungle', 'ring-2', 'ring-aetheria-jungle');
      } else {
        card.classList.remove('border-aetheria-jungle', 'ring-2', 'ring-aetheria-jungle');
      }
    }
  });
  showToast(`Alojamiento seleccionado: ${state.selectedRoom.name}`, 'info');
};

function renderServices() {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.innerHTML = SERVICES.map(s => `
    <div onclick="toggleService(${s.id})" id="service-card-${s.id}" class="bg-white rounded-2xl overflow-hidden border-2 border-transparent shadow-sm hover:shadow-md cursor-pointer transition text-center p-3">
      <img src="${s.img}" class="h-28 w-full object-cover rounded-xl mb-3">
      <h5 class="font-bold text-xs text-slate-800 line-clamp-1">${s.name}</h5>
      <p class="text-xs text-gray-400 my-1"><i class="fa-solid fa-clock mr-1"></i>${s.duration}</p>
      <span class="text-sm font-extrabold text-aetheria-gold">$${s.price} USD</span>
    </div>
  `).join('');
}

window.toggleService = function(id) {
  const index = state.selectedServices.indexOf(id);
  const card = document.getElementById(`service-card-${id}`);

  if (index === -1) {
    state.selectedServices.push(id);
    if (card) card.classList.add('border-aetheria-gold', 'bg-amber-50/50');
  } else {
    state.selectedServices.splice(index, 1);
    if (card) card.classList.remove('border-aetheria-gold', 'bg-amber-50/50');
  }
};

function renderSlots() {
  const container = document.getElementById('slots-container');
  if (!container) return;

  container.innerHTML = SLOTS.map(slot => `
    <button onclick="selectSlot('${slot}')" id="slot-btn-${slot.replace(/[^a-zA-Z0-9]/g, '')}" class="slot-btn bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:border-aetheria-jungle transition">
      ${slot}
    </button>
  `).join('');

  selectSlot('10:00 hrs');
}

window.selectSlot = function(slot) {
  state.selectedSlot = slot;
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('bg-aetheria-jungle', 'text-white', 'border-aetheria-jungle'));
  const activeBtn = document.getElementById(`slot-btn-${slot.replace(/[^a-zA-Z0-9]/g, '')}`);
  if (activeBtn) activeBtn.classList.add('bg-aetheria-jungle', 'text-white', 'border-aetheria-jungle');
};

window.goToConfirmScreen = function() {
  if (!state.selectedRoom) {
    state.selectedRoom = ROOMS[0];
  }

  calculateTotals();

  const detailsContainer = document.getElementById('confirm-details');
  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div class="flex items-center space-x-4 border-b border-gray-100 pb-4">
        <img src="${state.selectedRoom.mainImage}" class="h-20 w-28 object-cover rounded-xl shadow-sm">
        <div>
          <h4 class="font-extrabold text-xl text-aetheria-emerald">${state.selectedRoom.name}</h4>
          <p class="text-xs text-gray-500 mt-1"><i class="fa-solid fa-users mr-1"></i> ${state.selectedRoom.capacity} · <i class="fa-solid fa-calendar mr-1"></i> ${state.nights} noche(s)</p>
        </div>
      </div>
      <div class="pt-2 text-xs text-gray-600 space-y-1">
        <p><strong>Fechas:</strong> ${state.checkIn} al ${state.checkOut}</p>
        <p><strong>Horario preferencia:</strong> ${state.selectedSlot}</p>
        <p><strong>Servicios extra:</strong> ${state.selectedServices.length > 0 ? state.selectedServices.map(sId => SERVICES.find(s=>s.id===sId).name).join(', ') : 'Ninguno'}</p>
      </div>
      <div class="mt-4">
        <p class="font-bold text-xs text-gray-500 uppercase mb-2">Galería de tu villa:</p>
        <div class="grid grid-cols-3 gap-2">
          ${state.selectedRoom.gallery.map(img => `<img src="${img}" class="rounded-lg h-16 w-full object-cover">`).join('')}
        </div>
      </div>
    `;
  }

  navTo('view-confirm');
};

window.calculateTotals = function() {
  const roomTotal = state.selectedRoom ? (state.selectedRoom.price * state.nights) : 0;
  const servicesTotal = state.selectedServices.reduce((sum, sId) => {
    const service = SERVICES.find(s => s.id === sId);
    return sum + (service ? service.price : 0);
  }, 0);

  const subtotal = roomTotal + servicesTotal;
  const total = Math.max(0, subtotal - state.discount);

  const elemNights = document.getElementById('summary-nights');
  const elemRoom = document.getElementById('summary-room');
  const elemServices = document.getElementById('summary-services');
  const elemDiscount = document.getElementById('summary-discount');
  const elemTotal = document.getElementById('summary-total');

  if (elemNights) elemNights.innerText = state.nights;
  if (elemRoom) elemRoom.innerText = `$${roomTotal} USD`;
  if (elemServices) elemServices.innerText = `$${servicesTotal} USD`;
  if (elemDiscount) elemDiscount.innerText = `-$${state.discount} USD`;
  if (elemTotal) elemTotal.innerText = `$${total} USD`;
};

window.applyCoupon = function() {
  const couponInput = document.getElementById('coupon-code');
  const code = couponInput ? couponInput.value.trim().toUpperCase() : '';
  if (code === 'AETHERIA10') {
    state.discount = 50;
    showToast('¡Cupón de $50 USD aplicado!', 'info');
  } else {
    showToast('Cupón inválido', 'error');
  }
  calculateTotals();
};

window.finalizeBooking = function() {
  const folio = 'AETH-' + Math.floor(100000 + Math.random() * 900000);
  showToast('¡Reserva confirmada con éxito!', 'info');

  const detailsContainer = document.getElementById('confirm-details');
  if (detailsContainer) {
    detailsContainer.innerHTML = `
      <div class="text-center py-4">
        <i class="fa-solid fa-circle-check text-aetheria-gold text-5xl mb-3"></i>
        <h3 class="text-2xl font-bold text-aetheria-emerald">¡Reserva Confirmada!</h3>
        <p class="text-xs text-gray-500 font-mono mt-1">Folio de confirmación: <span class="font-bold text-slate-800">${folio}</span></p>
      </div>
      <div class="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-700">
        <p><strong>Huésped:</strong> ${state.user ? state.user.name : 'Cliente Invitado'}</p>
        <p><strong>Villa:</strong> ${state.selectedRoom.name}</p>
        <p><strong>Fechas:</strong> ${state.checkIn} al ${state.checkOut} (${state.nights} noches)</p>
        <p><strong>Horario Check-In:</strong> ${state.selectedSlot}</p>
      </div>
    `;
  }
};
