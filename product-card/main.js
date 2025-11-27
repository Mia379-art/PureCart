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
  }

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


  // اینجا هم متفاوت میشه دیگه تو نمیدونی قراره کارت اد شه 
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

// LocalStorage

// متد اد کارت جدید تو لوکال استوریج
// متد های کلی برای اینکه از لوکال استوریج استفاده کنی کراد لوکال استوریج


// اسم وردی بشه کارت
const saveCardToLocal = (cardData) => {
  let existingCards = JSON.parse(localStorage.getItem("cards")) || [];

  // 
  // const existingCard = existingCards.find((c) => c.id === cardData.id);

  // if (existingCard) {
  //   cardData.quantity = existingCard.quantity + 1;
  //   existingCards = existingCards.filter((c) => c.id !== cardData.id);
  // }

  existingCards.push(cardData);
  localStorage.setItem("cards", JSON.stringify(existingCards));
};

// متد ادیت کارت جدید تو لوکال استوریج
// اسم وردی بشه کارت
// راهنمایی - برای این بخش ایدی کارتی که تو وردی اومده رو میری تو لوکال استوریج پیداش میکنی و 
// محتواش رو ادیت میزنی و ذخیره میکنی


// متد دلیت کارت جدید تو لوکال استوریج
// اسم وردی بشه کارت
// همون حرکت قبلی ایدی کارت ووردی ولی اینبار از لوکال استوریج حذف میشه


// متد گت تک ایتم از لوکال استوریج نمایش تکی کارت برای صفحه جزعیات هر کارت



// متد گت همه ایتم ها از لوکال استوریج برای نمایش لیست کارت ها












// ساخت کارت روی صفحه (فقط برای پرنت خودش)
function createCard(card) {
  // ساخت کارت
  const newCard = document.createElement("div");
  newCard.classList.add("main_box");

  // تصویر
  const imgBox = document.createElement("div");
  imgBox.classList.add("image_box");
  const img = document.createElement("img");
  img.src = card.img;
  img.classList.add("card-img");
  imgBox.appendChild(img);

  // نام محصول
  const textBox = document.createElement("div");
  textBox.classList.add("text_box");
  const h2 = document.createElement("h2");
  h2.textContent = card.name;
  textBox.appendChild(h2);

  // قیمت
  const priceBox = document.createElement("div");
  priceBox.classList.add("price_box");
  const spanPrice = document.createElement("span");
  spanPrice.classList.add("main_price");
  spanPrice.textContent = card.price;
  priceBox.appendChild(spanPrice);
  priceBox.appendChild(document.createTextNode("تومان"));

  // تعداد
  const quantityBox = document.createElement("div");
  quantityBox.classList.add("quantity_box");
  quantityBox.textContent = `تعداد: ${card.quantity}`;

  // ستاره‌ها
  const starBox = document.createElement("div");
  starBox.classList.add("stars");
  starBox.innerHTML = "⭐".repeat(card.stars);

  // دکمه خرید
  const buyBox = document.createElement("div");
  buyBox.classList.add("buy_product");
  const buyBtn = document.createElement("button");
  buyBtn.textContent = "خرید محصول";
  buyBtn.classList.add("buy-btn");
  buyBox.appendChild(buyBtn);

  // دکمه حذف و ویرایش
  const actionBox = document.createElement("div");
  actionBox.classList.add("action_box");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "حذف";
  deleteBtn.classList.add("delete-btn");
  const editBtn = document.createElement("button");
  editBtn.textContent = "ویرایش";
  editBtn.classList.add("edit-btn");
  actionBox.appendChild(deleteBtn);
  actionBox.appendChild(editBtn);

  // اضافه کردن همه المان‌ها به کارت
  newCard.appendChild(imgBox);
  newCard.appendChild(textBox);
  newCard.appendChild(priceBox);
  newCard.appendChild(quantityBox);
  newCard.appendChild(starBox);
  newCard.appendChild(buyBox);
  newCard.appendChild(actionBox);

  // اضافه کردن کارت به کانتینر
  document.querySelector(".main_countainer").appendChild(newCard);

  // مدیریت خرید کارت (فقط روی همین کارت)
  buyBtn.addEventListener("click", () => {
    if (card.quantity > 0) {
      card.quantity -= 1;
      quantityBox.textContent = `تعداد: ${card.quantity}`;

      let cards = JSON.parse(localStorage.getItem("cards")) || [];
      cards = cards.map((c) =>
        c.id === card.id ? { ...c, quantity: card.quantity } : c
      );
      localStorage.setItem("cards", JSON.stringify(cards));
    }
  });

  // حذف کارت (فقط روی همین کارت)
  deleteBtn.addEventListener("click", () => {
    newCard.remove();
    let cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards = cards.filter((c) => c.id !== card.id);
    localStorage.setItem("cards", JSON.stringify(cards));
  });

  // ویرایش کارت (فقط روی همین کارت)
  editBtn.addEventListener("click", () => {
    inputs[1].value = card.name;
    inputs[2].value = card.price;
    inputs[3].value = card.quantity;
    document.getElementById("starInput").value = card.stars;
    form.setAttribute("data-edit-id", card.id);
    form.scrollIntoView({ behavior: "smooth" });
  });
}

// بارگذاری کارت‌ها از localStorage
window.addEventListener("load", () => {
  const cards = JSON.parse(localStorage.getItem("cards")) || [];
  cards.forEach((card) => createCard(card));
});
