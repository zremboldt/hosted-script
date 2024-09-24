(function () {
  const config = window.rootRc1WidgetConfig || {};

  const ROOT_API_ENDPOINT = "https://root.com/api/submit";
  const VEHICLE = config.vehicle;
  const THEME = config.theme || "light";
  const WIDGET_PLACEMENT = config.widgetPlacement;
  const PID = config.pid;

  // Create and inject CSS
  const style = document.createElement("style");
  style.textContent = `
    #root-rc1-widget *,
    #root-rc1-widget *:after,
    #root-rc1-widget *:before {
      box-sizing: border-box;
      margin: 0;
    }

    #root-rc1-widget,
    #root-rc1-widget[data-theme="light"] {
      --background: 0 0% 100%;
      --foreground: 240 10% 4%;
      color-scheme: light only;
    }
    #root-rc1-widget[data-theme="dark"] {
      --background: 240 10% 4%;
      --foreground: 60 9% 98%;
      color-scheme: dark only;
    }

    #root-rc1-widget {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial,
        sans-serif, system-ui;

      --ease: linear(
        0 0%,
        0.0036 9.62%,
        0.0185 16.66%,
        0.0489 23.03%,
        0.0962 28.86%,
        0.1705 34.93%,
        0.269 40.66%,
        0.3867 45.89%,
        0.5833 52.95%,
        0.683 57.05%,
        0.7829 62.14%,
        0.8621 67.46%,
        0.8991 70.68%,
        0.9299 74.03%,
        0.9545 77.52%,
        0.9735 81.21%,
        0.9865 85%,
        0.9949 89.15%,
        1 100%
      );
      --ease-out: linear(
        0 0%,
        0.4322 6.7%,
        0.5876 9.63%,
        0.7165 12.53%,
        0.8238 15.53%,
        0.9087 18.63%,
        0.9731 21.89%,
        1.0188 25.4%,
        1.0377 27.67%,
        1.0507 30.11%,
        1.058 32.77%,
        1.0598 35.74%,
        1.0528 41.1%,
        1.0164 56.54%,
        1.004 65.49%,
        0.998 78.52%,
        1 100%
      );
      --sw: 160px;
      --sh: 48px;
      --ew: 320px;
      --eh: 266px;

      --padding: 0.675rem;
      --radius: 6px;
      --speed: 0.35s;

      --border: color-mix(in lch, canvasText, transparent 90%);
      --hr: color-mix(in lch, canvas, canvasText 10%);
      --starting: color-mix(in lch, canvas, canvasText 8%);
      --text: canvasText;
      --primary: 19 100% 50%;
      --primary-foreground: 0 0% 98%;
    }

    #root-rc1-widget {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      box-shadow: 0 6px 10px -2px hsl(0 0% 0% / 0.15);
      background-color: white;
      border-radius: var(--radius);
      overflow: hidden;

      .accent {
        position: absolute;
        inset: 0;
        height: 5px;
        background-color: hsl(var(--primary));
      }

      .text-container {
        display: flex;
        flex-direction: column;
        gap: var(--padding);

        p {
          max-width: 50ch;
          line-height: 1.5;
          color: hsl(0, 0%, 40%);
        }
      }

      .get-quote-button {
        width: var(--sw);
        height: var(--sh);
        border-radius: calc(var(--sh) * 0.1);
        border: 0;
        padding: 0;
        background: var(--starting);
        font-size: 1rem;
        border: 1px solid var(--border);
        color: var(--text);
        anchor-name: --control;
      }

      /* The Popover */
      #disclose {
        margin: 0;
        border: 0;
        padding: 0;
        position-anchor: --control;
        inset-area: var(--inset, center);
        width: anchor-size(width);
        height: anchor-size(height);
        border-radius: calc(var(--sh) * 0.1);
        background-color: var(--starting);
        color: var(--text);

        overflow: hidden;

        transition-property: display, overlay, height, width, border-radius,
          box-shadow, background-color, border-color, color;
        transition-behavior: allow-discrete;
        transition-duration: var(--speed);
        transition-timing-function: var(--ease);

        &:popover-open {
          height: var(--eh);
          width: var(--ew);
          border-radius: var(--radius);
          box-shadow: 0 0 0 1px var(--border), 0 10px 14px -4px hsl(0 0% 0% / 0.15);
          background-color: canvas;
          color: canvasText;
          transition-duration: calc(2 * var(--speed));
          transition-timing-function: var(--ease-out);
        }

        @starting-style {
          &:popover-open {
            background-color: var(--starting);
            color: var(--text);
            width: anchor-size(--control width);
            height: anchor-size(--control height);
            border-radius: calc(var(--sh) * 0.5);
            box-shadow: hsl(0 0% 0% / 0);
          }
        }
      }
      #disclose:popover-open {
        display: grid;
        align-items: start;
      }
      #disclose header {
        display: inline-flex;
        margin: 0 auto;
        transition: width var(--speed), height var(--speed);
        width: anchor-size(--control width);
        height: anchor-size(--control height);
        height: var(--sh);
        align-items: center;
        justify-content: center;
        border: 0;
        position: relative;
        transition: translate var(--speed);
        padding-inline: var(--padding);
      }
      #disclose header::after {
        content: "";
        position: absolute;
        bottom: 0.5rem;
        width: calc(var(--ew) * 2);
        left: 50%;
        opacity: 0;
        height: 1px;
        background: var(--hr);
        translate: -50% -50%;
        transition: opacity var(--speed);
      }
      #disclose:popover-open header::after {
        opacity: 1;
      }
      @starting-style {
        #disclose:popover-open header::after {
          opacity: 0;
        }
      }

      header {
        span {
          transform-origin: 0 0;
          transition: scale var(--speed), translate var(--speed);
          display: flex;
          gap: var(--padding);
        }

        button {
          position: absolute;
          left: 0;
          top: 50%;
          translate: calc(var(--ew) - (100%)) -50%;
          display: grid;
          place-items: center;
          justify-content: end;
          padding: 0;
          padding-right: var(--padding);
          width: 48px;
          height: 48px;
          background: transparent;
          cursor: pointer;
          border: 0;
          outline-color: hsl(var(--foreground) / 0.2);
          outline-offset: -0.875rem;
        }

        svg {
          width: 20px;
        }
      }

      #disclose:popover-open header {
        translate: calc(var(--ew) * -0.5 + (50% + 0.25rem)) -0.5rem;
        transition-timing-function: var(--ease-out);
        transition-duration: calc(2 * var(--speed));

        span {
          scale: 0.875;

          svg {
            opacity: 0;
            scale: 0;
            @starting-style {
              opacity: 1;
              scale: 1;
            }
          }

          @starting-style {
            scale: 1;
          }
        }

        @starting-style {
          translate: 0 0;
        }
      }

      #disclose:not(:popover-open) header {
        translate: 0 0;
      }

      .form {
        width: var(--ew);
        height: calc(var(--eh) - (48px - 0.875rem));
        padding: var(--padding);
        position: absolute;
        top: calc(48px - 1rem);
        left: 50%;
        translate: -50% 2rem;
        font-size: 0.875rem;
        opacity: 0;
        filter: blur(4px);
        transition: translate var(--speed), opacity var(--speed),
          filter var(--speed);
        display: flex;
        flex-direction: column;
        gap: var(--padding);

        fieldset {
          display: flex;
          gap: var(--padding);
          max-width: 320px;
          border: 0;
          padding: 0;
          margin: 0;
        }

        input,
        select {
          outline-color: hsl(var(--foreground) / 0.2);
          border: 1px solid var(--border);
          padding: calc(var(--padding) * 1.25) 1rem;
          border-radius: var(--radius);
          width: 100%;
          color: hsl(0, 0%, 30%);
        }

        select {
          appearance: none;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevrons-up-down"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>');
          background-repeat: no-repeat;
          background-position: right 8px center;
        }

        button {
          padding: calc(var(--padding) * 1.25) 1rem;
          background-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border-radius: var(--radius);
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          outline-color: hsl(var(--foreground) / 0.2);
          border: 0;
        }
      }

      #disclose:popover-open .form {
        opacity: 1;
        translate: -50% 0;
        filter: blur(0);
      }

      @starting-style {
        #disclose:popover-open .form {
          opacity: 0;
          translate: -50% 2rem;
          filter: blur(4px);
        }
      }
    }
  `;
  document.head.appendChild(style);

  // Create and inject HTML
  const widgetHtml = `
    <div id="root-rc1-widget" data-theme="${THEME}">
      <div class="accent"></div>
      <div class="text-container">
        <h2>Protect your vehicle</h2>
        <p>
          Get an insurance estimate in seconds right here in the sidebar.
          Provided by our trusted partner, Root.
        </p>
      </div>

      <button
        class="get-quote-button"
        popovertarget="disclose"
        popovertargetaction="toggle"
      >
        Get a quote
      </button>

      <div popover="auto" id="disclose" class="disclosure">
        <header>
          <span>Get a quote</span>
          <button popovertarget="disclose" popovertargetaction="close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>
        <form id="root-rc1-form" class="form">
          <fieldset>
            <input
              type="text"
              name="firstName"
              required="required"
              placeholder="First name"
              autocomplete="given-name"
            />
            <input
              type="text"
              name="lastName"
              required="required"
              placeholder="Last name"
              autocomplete="family-name"
            />
          </fieldset>
          <input
            type="date"
            name="birthDate"
            required="required"
            placeholder="mm.dd.yyyy"
            date-format="mm.dd.yyyy"
            autocomplete="bday"
          />
          <fieldset>
            <select name="state" required="required">
              <option value="" disabled selected>State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <input
              type="text"
              name="zip"
              required="required"
              placeholder="Zip code"
              autocomplete="postal-code"
            />
          </fieldset>
          <input type="hidden" name="year" value="${VEHICLE.year}" />
          <input type="hidden" name="make" value="${VEHICLE.make}" />
          <input type="hidden" name="model" value="${VEHICLE.model}" />
          <button>Calculate</button>
        </form>
      </div>
    </div>
  `;

  // document
  //   .querySelector(WIDGET_PLACEMENT)
  //   .insertAdjacentHTML("afterend", widgetHtml);

  document
    .querySelector(".sidebar-lead-form-container")
    .insertAdjacentHTML("afterend", widgetHtml);
  // document.body.insertAdjacentHTML("beforeend", widgetHtml);

  // Handle form submission
  document
    .getElementById("root-rc1-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch(ROOT_API_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Form submitted successfully!");
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    });
})();
