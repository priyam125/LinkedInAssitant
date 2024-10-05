export default defineBackground(() => {
  // console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.message) {
      console.log('Content script sent message:', message);
    }
  });
});
