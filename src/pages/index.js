import "./index.css";
import {setBtnText, setDeleteBtnText} from "../utils/helpers.js";
import {enableValidation, resetValidation, disabledBtn, settings} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "54348709-dfc8-4c17-a440-374026562e88",
    "Content-Type": "application/json"
  }
});

api.getAppInfo()
.then(([userInfo, cards]) => {
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__subtitle');
const profileAvatar = document.querySelector('.profile__avatar-image');

profileTitle.textContent = userInfo.name
profileDescription.textContent = userInfo.about
profileAvatar.src = userInfo.avatar

  cards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});
})
.catch(console.error);


const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const avatarModalButton = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__subtitle");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const nameInput = editModal.querySelector("#profile-name-input");
const descriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardForm = cardModal.querySelector(".modal__form");
const cardsubmitbtn = cardModal.querySelector(".modal__submit-btn");
const cardNameInput = cardModal.querySelector("#add-card-description-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarsubmitbtn = avatarModal.querySelector(".modal__submit-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteform = deleteModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalClsBtn = previewModal.querySelector(".modal__close-btn_type_preview");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard = null;
let selectedCardId = null;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLinkEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  if (data.isLiked) {
cardLikeBtn.classList.add('card__like-btn_active');
}

  cardNameEl.textContent = data.name;
  cardLinkEl.src = data.link;
  cardLinkEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
const isLiked = cardLikeBtn.classList.contains('card__like-btn_active');
api.handleLikedStatus(data._id, isLiked)
 .then((res) => {
   cardLikeBtn.classList.toggle('card__like-btn_active');
 })
 .catch((err) => console.log(`Error: ${err}`));
});

  cardLinkEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  })

  return cardElement;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
 setBtnText(submitBtn, true);
  api
    .editUserInfo({name: nameInput.value, about: descriptionInput.value})
    .then((data) => {
    profileName.textContent = data.name;
    profileDescription.textContent = data.about;
    closeModal(editModal);
    evt.target.reset();
    setBtnText(submitBtn, false);
    })
    .catch((err) => {
      console.error(err);
      setBtnText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  descriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, [nameInput, descriptionInput], settings);
  openModal(editModal);
});

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
 setBtnText(submitBtn, true);
api
  .postCard({name: cardNameInput.value, link: cardLinkInput.value})
  .then((data) => {
  const cardEl = getCardElement(data);
  cardsList.prepend(cardEl);
    disabledBtn(submitBtn, settings);
    evt.target.reset();
    setBtnText(submitBtn, false);
  })
  .catch((err) => {
      console.error(err);
      setBtnText(submitBtn, false);
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
 setBtnText(submitBtn, true);
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      const avatarImage = document.querySelector('.profile__avatar-image');
      avatarImage.src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
      setBtnText(submitBtn, false);
    })
    .catch((err) => {
      console.error(err);
      setBtnText(submitBtn, false);
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setDeleteBtnText(submitBtn, true);
  api
    .deleteCard(selectedCardId)
    .then(() => {
      const cardElement = document.querySelector(`[data-card-id="${selectedCardId}"]`);
      selectedCard.remove();
      closeModal(deleteModal);
      setDeleteBtnText(submitBtn, false);
    })
    .catch((err) => {
      console.error(err);
      setDeleteBtnText(submitBtn, false);
    });
  }

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

previewModalClsBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

function closeOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", closeOverlay);

  function keydownListener(evt) {
    if (evt.key === "Escape" || evt.key === "Esc") {
      closeModal(modal);
    }
  }

  document.addEventListener("keydown", keydownListener);

  modal.keydownListener = keydownListener;
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", closeOverlay)

  document.removeEventListener("keydown", modal.keydownListener);
}

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
deleteform.addEventListener("submit", handleDeleteSubmit);


enableValidation(settings);