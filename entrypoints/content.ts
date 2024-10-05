export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log('Hello content.');
    const button = document.createElement('button');
    button.textContent = 'Click me to send message';
    button.addEventListener('click', handleClick);
    document.body.appendChild(button);

    function handleClick() {
      console.log("button clicked");
      browser.runtime.sendMessage({ message: Date.now() });
    }
  },
});
