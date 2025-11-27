const form = document.querySelector(".main_form");
const submitBtn = document.querySelector(".main_form_btn");
const inputs = form.querySelectorAll("input");

//  ولیدیشن
submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  let isFormValid = true;

  inputs.forEach((input) => {
    const errorMsg = input.nextElementSibling;
    if (!input.checkValidity()) {
      input.classList.add("input-error");
      input.classList.remove("input-success");
      errorMsg.textContent = "فیلد را درست پر کنید";
      errorMsg.classList.add("error-msg");
      errorMsg.classList.remove("success-msg");
      isFormValid = false;
    } else {
      input.classList.add("input-success");
      input.classList.remove("input-error");
      errorMsg.textContent = "درست است";
      errorMsg.classList.add("success-msg");
      errorMsg.classList.remove("error-msg");
    }
  });

  if (!isFormValid) return;

  console.log("فرم درست پر شده!");

  // گرفتن فایل عکس
  const file = inputs[0].files[0];
  const base64Image = await getBase64(file);

  function NewRecordId() {
    const existingCards = JSON.parse(localStorage.getItem("cards")) || [];
    if (existingCards.length === 0) return 1;
    const ids = existingCards.map((card) => card.id);
    const maxId = Math.max(...ids);
    return maxId + 1;
  }

  // بررسی اینکه آیا فرم در حالت ادیت است یا ایجاد آیتم جدید
  const editingId = form.getAttribute("data-edit-id");

  if (editingId) {
    // حالت ادیت: id موجود را نگه می‌داریم و فیلدها را آپدیت می‌کنیم
    const idNum = Number(editingId);
    const existing = getCardById(idNum) || {};

    const updatedCard = {
      id: idNum,
      createDate: existing.createDate || Date.now(),
      img: base64Image || existing.img || "",
      name: inputs[1].value,
      price: inputs[2].value,
      quantity: +inputs[3].value,
      stars: +document.getElementById("starInput").value,
    };

    // ذخیره در localStorage (ویرایش)
    editCardInLocal(updatedCard);

    // به‌روزرسانی DOM برای کارت مربوطه (بدون reload)
    const cardEl = document.getElementById(String(idNum));
    if (cardEl) {
      const imgEl = cardEl.querySelector(".card-img");
      if (imgEl) imgEl.src = updatedCard.img;

      const nameEl = cardEl.querySelector(".text_box h2");
      if (nameEl) nameEl.textContent = updatedCard.name;

      const priceEl = cardEl.querySelector(".main_price");
      if (priceEl) priceEl.textContent = updatedCard.price;

      const qtyEl = cardEl.querySelector(".quantity_box");
      if (qtyEl) qtyEl.textContent = `تعداد: ${updatedCard.quantity}`;

      const starsEl = cardEl.querySelector(".stars");
      if (starsEl) starsEl.innerHTML = "⭐".repeat(updatedCard.stars);
    }

    // پاک‌کردن حالت ادیت فرم و ریست فرم
    form.removeAttribute("data-edit-id");
    inputs.forEach((input) => {
      input.value = "";
      input.classList.remove("input-error", "input-success");
      const errorMsg = input.nextElementSibling;
      if (errorMsg) errorMsg.textContent = "";
    });
    inputs[0].focus();
    return; // ← جلوگیری از اجرای بخش ایجاد کارت جدید
  }

  // حالت ایجاد کارت جدید
  const cardData = {
    id: NewRecordId(),
    createDate: new Date().toISOString(), // ← UTC
    img: base64Image,
    name: inputs[1].value,
    price: inputs[2].value,
    quantity: +inputs[3].value,
    stars: +document.getElementById("starInput").value,
  };

  console.log(cardData);

  saveCardToLocal(cardData);
  createCard(cardData);

  // ریست کردن فرم
  inputs.forEach((input) => {
    input.value = "";
    input.classList.remove("input-error", "input-success");
    const errorMsg = input.nextElementSibling;
    if (errorMsg) errorMsg.textContent = "";
  });

  inputs[0].focus();
});

function getBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// متد اد کارت جدید تو لوکال استوریج
const saveCardToLocal = (cardData) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];
  existingCards.push(cardData);
  localStorage.setItem("cards", JSON.stringify(existingCards));
};

// گرفتن همه کارت‌ها
const getAllCards = () => {
  return JSON.parse(localStorage.getItem("cards")) || [];
};

// گرفتن کارت با id
const getCardById = (id) => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  return cards.find((c) => c.id === id) || null;
};

// ویرایش کارت
const editCardInLocal = (updatedCard) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];
  const index = existingCards.findIndex((c) => c.id === updatedCard.id);
  if (index === -1) return false;
  existingCards[index] = { ...existingCards[index], ...updatedCard };
  localStorage.setItem("cards", JSON.stringify(existingCards));
  return true;
};

// متد ذخیره sold item در یک set جدا
const saveSoldItem = (soldData) => {
  let existingSold = JSON.parse(localStorage.getItem("soldItems")) || [];
  existingSold.push(soldData);
  localStorage.setItem("soldItems", JSON.stringify(existingSold));
};

// حذف کارت
const deleteCardFromLocal = (cardId) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];
  existingCards = existingCards.filter((c) => c.id !== cardId);
  localStorage.setItem("cards", JSON.stringify(existingCards));
};

// اصلاح این کارت ها روی صفحه
function createCard(card) {
  const newCard = document.createElement("div");
  newCard.classList.add("main_box");
  newCard.setAttribute("id", card.id);

  newCard.innerHTML = `
 <div class="image_box" id="${card.id}">
    <img src="${card.img}" alt="" class="card-img">
  </div>

  <div class="text_box">
    <h2>${card.name}</h2>
  </div>

  <div class="price_box">
    <span class="main_price">${card.price}</span>
    تومان
  </div>

  <div class="quantity_box">
    تعداد: ${card.quantity}
  </div>

  <div class="stars">
    ${"⭐".repeat(card.stars)}
  </div>

  <div class="buy_product">
    <button class="buy-btn">خرید محصول</button>
  </div>

  <div class="action_box">
    <button class="delete-btn">حذف</button>
    <button class="edit-btn">ویرایش</button>
  </div>
  `;

  document.querySelector(".main_countainer").appendChild(newCard);

  const deleteBtn = newCard.querySelector(".delete-btn");
  const editBtn = newCard.querySelector(".edit-btn");
  const buyBtn = newCard.querySelector(".buy-btn");
  const qtyEl = newCard.querySelector(".quantity_box");

  // حذف کارت از صفحه + لوکال
  deleteBtn.addEventListener("click", () => {
    deleteCardFromLocal(card.id);
    newCard.remove();
  });

  // ویرایش کارت
  editBtn.addEventListener("click", () => {
    inputs[1].value = card.name;
    inputs[2].value = card.price;
    inputs[3].value = card.quantity;
    document.getElementById("starInput").value = card.stars;
    form.setAttribute("data-edit-id", card.id);
    form.scrollIntoView({ behavior: "smooth" });
  });

  // خرید محصول → کم کردن تعداد و ذخیره sold item
  buyBtn.addEventListener("click", () => {
    if (card.quantity > 0) {
      card.quantity -= 1; // کم کردن در آبجکت کارت
      qtyEl.textContent = `تعداد: ${card.quantity}`; // بروزرسانی DOM

      // بروزرسانی کارت در localStorage
      const allCards = getAllCards();
      const index = allCards.findIndex((c) => c.id === card.id);
      if (index !== -1) {
        allCards[index].quantity = card.quantity;
        localStorage.setItem("cards", JSON.stringify(allCards));
      }

      // ذخیره sold item در ست جدا
      saveSoldItem({
        id: card.id,
        name: card.name,
        price: card.price,
        date: Date.now(),
      });
    }
  });
}

// بارگذاری کارت‌ها از localStorage
window.addEventListener("load", () => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => createCard(card));
});
