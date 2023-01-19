import CircleType from 'circletype'
import { createAvatar } from '@dicebear/core'
import { funEmoji, identicon, initials } from '@dicebear/collection'

import styles from './styles.js'
import { isValidUrl, getRandomInt } from './utils.js'
import { uploadIcon } from './svgs.js'

let container
let sponsorNinjaProjectId
let sponsorNinjaClientSecret
const random = getRandomInt(10000)

// https://stripe.com/docs/payments/card-element

const avatar1 = createAvatar(funEmoji, { seed: random })
const avatar2 = createAvatar(identicon, { seed: random })
const avatar3 = createAvatar(initials, { seed: 'Anonymous' })

let sponsorNinjaCardNumber
let sponsorNinjaCardExpiry
let sponsorNinjaCardCvc

const images = [
  avatar1.toString(),
  avatar2.toString(),
  avatar3.toString(),
]

const values = {
  amount: 10,
  name: 'Anonymous',
  website: null,
  image: 0,
}

const { classes } = styles

const updateCircleText = wrapper => {
  const circleTypeTop = new CircleType(wrapper.querySelector(`.${classes.circleTextTop}`))
  circleTypeTop.radius(50)
  const circleTypeBottom = new CircleType(wrapper.querySelector(`.${classes.circleTextBottom}`))
  circleTypeBottom.radius(50).dir(-1)
}

const previewCircle = ({ name, image = 0, website }) => {
  const preview = document.createElement('a')

  preview.classList.add(classes.active)
  preview.classList.add(classes.donationCircle)
  preview.id = 'sponsor-ninja-preview'
  let bottomText = ''

  if (website) {
    preview.href = website
    preview.target = '_blank'
    preview.rel = 'noopener noreferrer'
    bottomText = `visit 🔗 `
  }

  preview.innerHTML = `
    <span class="${classes.circleImage}" id="sponsor-ninja-preview-image">${images[image]}</span>
    <span class="${classes.circleTextTop}">${name}</span>
    <span class="${classes.circleTextBottom}">${bottomText}</span>`

  return preview
}

const handleNameChange = e => {
  const value = e.target.value || 'Anonymous'
  const preview = document.querySelector(`#sponsor-ninja-preview`)
  const previewName = preview.querySelector(`.${classes.circleTextTop}`)

  previewName.innerHTML = value
  updateCircleText(preview)

  const newInitials = createAvatar(initials, { seed: value })
  const newAvatar = newInitials.toString()
  images[2] = newInitials

  document.querySelector('#sponsor-ninja-image-initials').innerHTML = newAvatar
  values.name = value

  if (values.image === 2) {
    document.querySelector('#sponsor-ninja-preview-image').innerHTML = newAvatar
  }
}

const handleWebsiteChange = e => {
  const preview = document.querySelector(`#sponsor-ninja-preview`)
  container.querySelector('#sponsor-ninja-website-input').removeAttribute('data-error')
  container.querySelector('#sponsor-ninja-website-input+span').innerHTML = ''

  if (e.target.value && isValidUrl(e.target.value)) {
    preview.href = e.target.value
    preview.target = '_blank'
    preview.rel = 'noopener noreferrer'
    preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = `visit 🔗`
    values.website = e.target.value
  } else {
    preview.removeAttribute('href')
    preview.removeAttribute('target')
    preview.removeAttribute('rel')
    preview.querySelector(`.${classes.circleTextBottom}`).innerHTML = ''
    values.website = null
  }

  updateCircleText(preview)
}

const handleValueChange = elem => {
  const newValue = parseInt(elem.dataset.value)
  values.amount = newValue
  setupStripeForm(newValue)

  const valueButtons = document.querySelectorAll(`#sponsor-ninja-amount-buttons button`)
  Array.from(valueButtons).map((e) => {
    if (e.dataset.value === elem.dataset.value) {
      e.classList.add(classes.activeButton)
    } else {
      e.classList.remove(classes.activeButton)
    }
  })
}

const handleImageChange = (e, i) => {
  values.image = i
  document.querySelector('#sponsor-ninja-preview-image').innerHTML = images[i]

  const imageButtons = document.querySelectorAll(`.${classes.imageContainer} > *`)
  Array.from(imageButtons).map((elem, index) => {
    if (index === i) {
      elem.classList.add(classes.profileActive)
    } else {
      elem.classList.remove(classes.profileActive)
    }
  })
}

const handleImageUpload = e => {
  const src = URL.createObjectURL(e.target.files[0])

  if (src) {
    images[3] = `<img src="${src}" alt="uploaded file preview" class="${classes.previewUploadImage}"/>`

    handleImageChange(null, 3)
  }
}

const shuffleImages = () => {
  const random = getRandomInt(10000)
  const newEmoji = createAvatar(funEmoji, { seed: random });
  const newIdenticon = createAvatar(identicon, { seed: random });

  const emojiString = newEmoji.toString()
  const identiconString = newIdenticon.toString()

  images[0] = emojiString
  images[1] = identiconString

  document.querySelector('#sponsor-ninja-image-emoji').innerHTML = emojiString
  document.querySelector('#sponsor-ninja-image-identicon').innerHTML = identiconString
  document.querySelector('#sponsor-ninja-preview-image').innerHTML = images[values.image]
}

const validateWebsite = e => {
  // todo validate and show warning if invalid
}

const setupStripeForm = (value = 10) => {
  fetch(`${process.env.DOMAIN}/api/donate?id=${sponsorNinjaProjectId}&value=${value}`)
    .then(res => res.json())
    .then(donateData => {
      const stripe = Stripe(donateData.user_public_key);
      sponsorNinjaClientSecret = donateData.client_secret
      const stripe_elements = stripe.elements();
      sponsorNinjaCardNumber = stripe_elements.create('cardNumber')
      sponsorNinjaCardExpiry = stripe_elements.create('cardExpiry')
      sponsorNinjaCardCvc = stripe_elements.create('cardCvc')

      sponsorNinjaCardNumber.mount('#sponsor-ninja-card-number');
      sponsorNinjaCardExpiry.mount('#sponsor-ninja-card-expiry')
      sponsorNinjaCardCvc.mount('#sponsor-ninja-card-cvc')
    })
}

const addButton = ({ name }) => `<a href="#" id="sponsor-ninja-new-donation" class="${classes.donationCircle}">
  +
  <span class="${classes.circleTextTop}">New Sponsor</span>
  <span class="${classes.circleTextBottom}"></span>
</a>
<div class="${classes.createModal}">
  <button class="${classes.modalCloseButton}">X</button>
  <h3>Your donation for<br/>${name}</h3>

  <div id="sponsor-ninja-tab-1">
    <div id="sponsor-ninja-amount-buttons" class="${classes.buttonGroup}">
      <button data-value="5">
        5$
      </button><button class="${classes.activeButton}" data-value="10">
        10$</button>
      <button data-value="25">25$</button><button data-value="50">
        50$
      </button>
    </div>

    <h3>Your depiction</h3>

    <label>Display Name</label>
    <input id="sponsor-ninja-name-input" type="text" maxlength="20" placeholder="Anonymous" />

    <label>Website</label>
    <input id="sponsor-ninja-website-input" type="text" placeholder="https://example.com" /><span></span>

    <label>Image</label>
    <div class="${classes.imageContainer}">
      <div id="sponsor-ninja-image-emoji" class="${classes.profileImage} ${classes.profileActive}">${images[0]}</div>
      <div id="sponsor-ninja-image-identicon" class="${classes.profileImage}">${images[1]}</div>
      <div id="sponsor-ninja-image-initials" class="${classes.profileImage}">${images[2]}</div>
      <label for="sponsor-ninja-file-upload" id="sponsor-ninja-upload-image" class="${classes.profileImage} ${classes.uploadImage}">${uploadIcon}</label>
      <input id="sponsor-ninja-file-upload" accept="image/*" type="file" class="${classes.fileInput}"/>
    </div>
    <span id="sponsor-ninja-shuffle-images" class="${classes.infoLink}">Shuffle Images</span>
  </div>

  <div id="sponsor-ninja-tab-2" class="${classes.hidden}">
    <label>Card Number</label>
    <div id="sponsor-ninja-card-number" class="${classes.stripeInputContainer}"></div>

    <label>Card Expiry</label>
    <div id="sponsor-ninja-card-expiry" class="${classes.stripeInputContainer}"></div>

    <label>Card CVC</label>
    <div id="sponsor-ninja-card-cvc" class="${classes.stripeInputContainer}"></div>
  </div>

  <button class="${classes.createButton}">Continue</button>
</div>`

const openModal = e => {
  e.preventDefault()

  if (!e.target.classList.contains(classes.active)) {
    e.target.classList.add(classes.active)
    container.querySelector(`.${classes.createModal}`).classList.add(classes.visible)

    const preview = previewCircle(values)
    container.prepend(preview)
    updateCircleText(container)
    setupStripeForm(10)
  }
}

const closeModal = () => {
  container.querySelector('#sponsor-ninja-new-donation').classList.remove(classes.active)
  container.querySelector(`.${classes.createModal}`).classList.remove(classes.visible)
  container.querySelector('#sponsor-ninja-preview').remove()
}

const renderWidget = async ({ id, targetElem }) => {
  let widgetState = 1 // 1 = basic data, 2 = payment data
  let stripeJs = document.createElement("script");
  stripeJs.type = "text/javascript";
  stripeJs.src = 'https://js.stripe.com/v3/';
  document.body.appendChild(stripeJs);

  container = document.createElement('div')
  container.classList.add(classes.container)

  // render placeholder
  for (let i = 0; i < 3; i++) {
    const placeholder = document.createElement('div')
    placeholder.classList.add(classes.placeholder)
    container.appendChild(placeholder)
  }

  targetElem.appendChild(container)

  const data = await fetch(`${process.env.DOMAIN}/api/project?id=${id}`).then(res => res.json())

  // -- render add button & modal -- //
  container.innerHTML = addButton({ name: data.name })
  updateCircleText(container)

  // open modal
  container.querySelector('#sponsor-ninja-new-donation').addEventListener('click', openModal)

  // close modal
  container.querySelector(`.${classes.modalCloseButton}`).addEventListener('click', closeModal)

  // update content
  container.querySelector('#sponsor-ninja-name-input').addEventListener('input', handleNameChange, false)
  container.querySelector('#sponsor-ninja-website-input').addEventListener('input', handleWebsiteChange, false)
  container.querySelector('#sponsor-ninja-website-input').addEventListener('change', validateWebsite)
  container.querySelector('#sponsor-ninja-shuffle-images').addEventListener('click', shuffleImages)
  container.querySelector('#sponsor-ninja-file-upload').addEventListener('change', handleImageUpload)

  const imageButtons = container.querySelectorAll(`.${classes.imageContainer} > div`)
  Array.from(imageButtons).map((el, i) => {
    el.addEventListener('click', e => handleImageChange(e, i))
  })

  const amountButtons = container.querySelectorAll('#sponsor-ninja-amount-buttons button')
  Array.from(amountButtons).map(el => {
    el.addEventListener('click', () => handleValueChange(el))
  })

  container.querySelector(`.${classes.createButton}`).addEventListener('click', async () => {
    if (widgetState === 1) {
      if (container.querySelector('#sponsor-ninja-website-input').value && !values.website) {
        const error = 'Invalid website. Please enter a valid website (including "https://") or remove the address.'
        container.querySelector('#sponsor-ninja-website-input').dataset.error = error
        container.querySelector('#sponsor-ninja-website-input+span').innerHTML = error
      } else {
        container.querySelector('#sponsor-ninja-tab-1').classList.add(classes.hidden)
        container.querySelector('#sponsor-ninja-tab-2').classList.remove(classes.hidden)
        container.querySelector(`.${classes.createButton}`).innerHTML = 'Complete Payment'
        widgetState = 2
      }
    } else {
      const result = await stripe.confirmCardPayment(sponsorNinjaClientSecret, {
        payment_method: {
          card: sponsorNinjaCardNumber
        }
      })

      if (result.error) {
        // Show error to your customer)
      } else {
        // TODO The payment succeeded!
      }

      console.log({ result })
    }
  })
}

// validate and run
const scriptTag = document.querySelector('script#sponsor-ninja-widget')

if (!scriptTag) {
  console.warn('Could not find sponsor ninja script - make sure to add the id="sponsor-ninja-widget" to the <script> tag')
} else {
  const { id, target } = scriptTag.dataset

  if (!id || !target) {
    console.warn('missing data attributes for sponsor-ninja-widget')
  } else {
    const targetElem = document.querySelector(target)
    sponsorNinjaProjectId = id

    if (!targetElem) {
      console.warn('could not find target DOM element for sponsor-ninja-widget')
    } else {
      renderWidget({ id, targetElem })
    }
  }
}