class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
      headers: {
        authorization: "54348709-dfc8-4c17-a440-374026562e88",
      },
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
