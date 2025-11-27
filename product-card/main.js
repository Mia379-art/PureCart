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

    // یک واحد اضافه کردن و ریترن کردن
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
    // به‌روزرسانی DOM برای کارت مربوطه
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
    return; // ← مهم! جلوگیری از اجرای بخش ایجاد کارت جدید
  }


    // میری توی لوکال استوریج و کل کارت های موجود رو برمیداری میاری نه کلشون رو فقط فیلد
    // id
    // بعد از اینکه اوردی تو لیستی از اعداد داری از بزرگ به کوچیک مربتبشون میکنی یا
    // کاری که خودت بلدی هدف اینه تو لیست اون اعداد ما برسیم به بزرگ ترین عدد مثال
    // 2 5 1 8 3 5
    // تو این لیست ما باید برسیم به 8 که از همه بزرگ تره
    // اونی که از همه بزرگ تر بود یه واحد بهش اضافه میشه الان اینجا 8 میشه 9 و 9 رو ریترن میکنی خروجی
    // این متد میشه

    // یه نکته اگر کارتی پیدا نکردی اون لیستت نال شد یه شرط میزاری که خروجی این بشه 1 کی میشه 1
    // زمانی که اولین کارت میخواد اد بشه
  

  // ساخت آبجکت کارت
  // موجودی م تو ورودی بگیر ازش
  const cardData = {
    id: NewRecordId(),
    createDate: Date.now(),
    img: base64Image,
    name: inputs[1].value,
    price: inputs[2].value,
    quantity: +inputs[3].value,
    stars: +document.getElementById("starInput").value,
  };

  console.log(cardData)


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
// متد های کلی برای اینکه از لوکال استوریج استفاده کنی کراد لوکال استوریج
const saveCardToLocal = (cardData) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];

  existingCards.push(cardData);

  localStorage.setItem("cards", JSON.stringify(existingCards));
};
const getAllCards = () => {
  return JSON.parse(localStorage.getItem("cards")) || [];
};
const getCardById = (id) => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  return cards.find((c) => c.id === id) || null;
};
//ویرایش کارت
const editCardInLocal = (updatedCard) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];

  const index = existingCards.findIndex((c) => c.id === updatedCard.id);

  if (index === -1) return false;

  existingCards[index] = {
    ...existingCards[index],
    ...updatedCard,
  };

  localStorage.setItem("cards", JSON.stringify(existingCards));
  return true;
};
//حذف کارت
const deleteCardFromLocal = (cardId) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];

  existingCards = existingCards.filter((c) => c.id !== cardId);

  localStorage.setItem("cards", JSON.stringify(existingCards));
};

  // بررسی اینکه آیا فرم در حالت ادیت است یا ایجاد آیتم جدید
  const editingId = form.getAttribute("data-edit-id");

  if (editingId) {
    // حالت ادیت: id موجود را نگه می‌داریم و فیلدها را آپدیت می‌کنیم
    const idNum = Number(editingId);
    const existing = getCardById(idNum) || {};

    const updatedCard = {
      id: idNum,
      // نگه داشتن تاریخ ایجاد قبلی اگر موجود باشد
      createDate: existing.createDate || Date.now(),
      // اگر فایل عکس جدید انتخاب شده باشه از base64Image استفاده کن در غیر اینصورت عکس قبلی رو نگه دار
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

  } else {
    // حالت ایجاد کارت جدید (همان کد قدیمی)
    const cardData = {
      id: NewRecordId(),
      createDate: Date.now(),
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
  }
  


// اسم وردی بشه کارت
// const saveCardToLocal = (cardData) => {
//   let existingCards = JSON.parse(localStorage.getItem("cards")) || [];

//   // 
//   // const existingCard = existingCards.find((c) => c.id === cardData.id);

//   // if (existingCard) {
//   //   cardData.quantity = existingCard.quantity + 1;
//   //   existingCards = existingCards.filter((c) => c.id !== cardData.id);
//   // }

//   existingCards.push(cardData);
//   localStorage.setItem("cards", JSON.stringify(existingCards));
// };

// متد ادیت کارت جدید تو لوکال استوریج
// اسم وردی بشه کارت
// راهنمایی - برای این بخش ایدی کارتی که تو وردی اومده رو میری تو لوکال استوریج پیداش میکنی و 
// محتواش رو ادیت میزنی و ذخیره میکنی


// متد دلیت کارت جدید تو لوکال استوریج
// اسم وردی بشه کارت





// همون حرکت قبلی ایدی کارت ووردی ولی اینبار از لوکال استوریج حذف میشه


// متد گت تک ایتم از لوکال استوریج نمایش تکی کارت برای صفحه جزعیات هر کارت



// متد گت همه ایتم ها از لوکال استوریج برای نمایش لیست کارت ها




// اصلاح این کارت ها روی صفحه
function createCard(card) {
  // ساخت کارت
  const newCard = document.createElement("div");
  newCard.classList.add("main_box");
  newCard.setAttribute("id", card.id); // ← اینجا id رو روی main_box گذاشتیم

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
  // دکمه‌های حذف و ویرایش که داخل innerHTML ساخته شدند
  const deleteBtn = newCard.querySelector(".delete-btn");
  const editBtn = newCard.querySelector(".edit-btn");

  // حذف کارت از صفحه + لوکال
  deleteBtn.addEventListener("click", () => {
    deleteCardFromLocal(card.id); // ← حذف از localStorage
    newCard.remove(); // ← حذف از DOM
  });

  // ویرایش کارت (فقط روی همین کارت)
  editBtn.addEventListener("click", () => {
    // مقداردهی فرم با داده‌های کارت
    inputs[1].value = card.name;
    inputs[2].value = card.price;
    inputs[3].value = card.quantity;
    document.getElementById("starInput").value = card.stars;

    // ذخیره id کارت داخل فرم (علامت اینکه ادیت است)
    form.setAttribute("data-edit-id", card.id);

    form.scrollIntoView({ behavior: "smooth" });
  });
  

  // مدیریت خرید کارت (فقط روی همین کارت)
  // buyBtn.addEventListener("click", () => {
  //   if (card.quantity > 0) {
  //     card.quantity -= 1;
  //     quantityBox.textContent = `تعداد: ${card.quantity}`;

  //     let cards = JSON.parse(localStorage.getItem("cards")) || [];
  //     cards = cards.map((c) =>
  //       c.id === card.id ? { ...c, quantity: card.quantity } : c
  //     );
  //     localStorage.setItem("cards", JSON.stringify(cards));
  //   }
  // });

  // حذف کارت (فقط روی همین کارت)
  // deleteBtn.addEventListener("click", () => {
  //   newCard.remove();
  //   let cards = JSON.parse(localStorage.getItem("cards")) || [];
  //   cards = cards.filter((c) => c.id !== card.id);
  //   localStorage.setItem("cards", JSON.stringify(cards));
  // });

  // ویرایش کارت (فقط روی همین کارت)
  // editBtn.addEventListener("click", () => {
  //   inputs[1].value = card.name;
  //   inputs[2].value = card.price;
  //   inputs[3].value = card.quantity;
  //   document.getElementById("starInput").value = card.stars;
  //   form.setAttribute("data-edit-id", card.id);
  //   form.scrollIntoView({ behavior: "smooth" });
  // });
}

// بارگذاری کارت‌ها از localStorage
window.addEventListener("load", () => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => createCard(card));
});
