import React from "react";
import ReactDOM from "react-dom/client";
import GenerateButton from "../components/GenerateButton.tsx";
import Modal from "@/components/ChatModal.tsx";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    let modalRoot: ReactDOM.Root | null = null;

    // Function to insert the custom button inside the desired div
    function insertReactButton(container: HTMLElement) {
      if (container.querySelector(".custom-button-container")) {
        return; // If button is already inserted, no need to add it again.
      }

      const buttonContainer = document.createElement("div");
      buttonContainer.classList.add("custom-button-container");
      buttonContainer.style.position = "absolute";
      buttonContainer.style.bottom = "0px";
      buttonContainer.style.right = "0px";
      buttonContainer.style.zIndex = "1000";

      container.style.position = "relative";
      container.appendChild(buttonContainer);

      // Render the GenerateButton component into the container
      const root = ReactDOM.createRoot(buttonContainer);
      root.render(
        React.createElement(GenerateButton, {
          onClick: () => {
            console.log("React Generate Button Clicked");
            showModal(); // Show modal on button click
          },
        })
      );
    }

    function showModal() {
      // Only show one modal at a time
      if (!modalRoot) {
        const modalContainer = document.createElement("div");
        modalContainer.id = "custom-modal-root";
        document.body.appendChild(modalContainer);

        modalRoot = ReactDOM.createRoot(modalContainer);

        modalRoot.render(
          React.createElement(Modal, {
            onInsert: (reply: string) => {
              const replyBox = document.querySelector(
                ".msg-form__contenteditable"
              ) as HTMLElement;
              const placeholder = document.querySelector(
                ".msg-form__placeholder"
              ) as HTMLElement;

              if (replyBox && placeholder) {
                const animatedReply = `<p class="slide-in-reply">${reply}</p>`;
                replyBox.innerHTML = animatedReply;
                placeholder.style.display = "none";
              }

              const inputEvent = new Event("input", { bubbles: true });
              replyBox.dispatchEvent(inputEvent);

              closeModal(); // Close modal after insertion
            },
            onClose: closeModal,
          })
        );
      }
    }

    function closeModal() {
      const modalContainer = document.querySelector("#custom-modal-root");
      if (modalContainer && modalRoot) {
        modalRoot.unmount(); // Unmount the React modal component
        modalContainer.remove(); // Remove the modal from the DOM
        modalRoot = null; // Reset the root for future modal rendering
      }
    }

    // // Attach event only if it's not already attached
    // function attachFocusListener(textArea: HTMLElement) {
    //   if (!textArea.hasAttribute("data-listener-attached")) {
    //     textArea.addEventListener("focus", () => {
    //       console.log("Textarea focused");
    //       const container = textArea.parentElement as HTMLElement;
    //       if (container) {
    //         insertReactButton(container); // Insert the button on focus
    //       }
    //     });

    //     // Listen for blur event to remove the button when the textarea loses focus
    //     // textArea.addEventListener("blur", () => {
    //     //   console.log("Textarea blurred, removing button");
    //     //   const buttonContainer = textArea.parentElement?.querySelector(
    //     //     ".custom-button-container"
    //     //   ) as HTMLElement;
    //     //   if (buttonContainer) {
    //     //     buttonContainer.remove(); // Remove the button when textarea loses focus
    //     //   }
    //     // });

    //     textArea.setAttribute("data-listener-attached", "true");
    //   }
    // }

    // Attach event only if it's not already attached
// Attach event only if it's not already attached
function attachFocusListener(textArea: HTMLElement) {
  if (!textArea.hasAttribute("data-listener-attached")) {
    // Handle focus to show the button
    textArea.addEventListener("focus", () => {
      console.log("Textarea focused");
      const container = textArea.parentElement as HTMLElement;
      if (container) {
        insertReactButton(container); // Insert the button on focus
      }
    });

    // Handle blur to hide/remove the button with a slight delay
    textArea.addEventListener("blur", () => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        const buttonContainer = textArea.parentElement?.querySelector(
          ".custom-button-container"
        ) as HTMLElement;

        // Only remove the button if the newly focused element is not inside the button container
        if (buttonContainer && !buttonContainer.contains(activeElement)) {
          console.log("Textarea blurred, removing button");
          buttonContainer.remove(); // Remove the button when textarea loses focus
        }
      }, 150); // Slight delay to allow click event to occur
    });

    textArea.setAttribute("data-listener-attached", "true");
  }
}



    // MutationObserver to detect the textarea
    function observeTextArea() {
      // Observer for the textarea inside the messaging section
      const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
          if (mutation.type === "childList") {
            const textArea = document.querySelector(
              ".msg-form__contenteditable"
            ) as HTMLTextAreaElement;
            if (textArea) {
              attachFocusListener(textArea);
              break;
            }
          }
        }
      });

      const targetNode = document.querySelector(".msg-form") || document.body;
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }

    // New logic: Listen for clicks on message cards
    function observeMessageCards() {
      // Observer for the list of message cards to detect when user switches between message threads
      const messageCardObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            const messageCards = document.querySelectorAll(
              ".msg-conversation-listitem__link"
            );

            messageCards.forEach((card) => {
              card.addEventListener("click", () => {
                console.log("Message card clicked, reattaching observers...");
                observeTextArea(); // Reattach observer for the new messaging section
              });
            });
          }
        });
      });

      // Target the container where message cards are loaded
      const messageListContainer = document.querySelector(
        ".msg-conversations-container"
      );
      if (messageListContainer) {
        messageCardObserver.observe(messageListContainer, {
          childList: true,
          subtree: true,
        });
      }
    }

    // Initial call to start observing the message cards and textarea
    observeMessageCards();
    observeTextArea();
  },
});
