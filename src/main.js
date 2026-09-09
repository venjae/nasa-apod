import './style.css'

const API_URL =
  `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}`

const image = document.querySelector('#apod-image')
const video = document.querySelector('#apod-video')
const title = document.querySelector('#apod-title')
const date = document.querySelector('#apod-date')
const description = document.querySelector('#apod-description')
const currentDate = document.querySelector('#current-date')

function setCurrentDate() {
  const today = new Date()

  currentDate.textContent = today.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase()
}

async function getAPOD() {
  try {
    const response = await fetch(API_URL)
    const data = await response.json()

    console.log('NASA RESPONSE:', data)

    if (!response.ok || data.error || !data.explanation) {
      throw new Error('NASA API did not return a valid APOD')
    }

    if (data.media_type === 'video') {
      image.style.display = 'none'
      video.style.display = 'block'
      video.src = data.url
    } else {
      video.style.display = 'none'
      image.style.display = 'block'
      image.src = data.url
      image.alt = data.title
    }

    title.textContent = data.title
    date.textContent = data.date

    typeText(description, data.explanation, 40)
  } catch (error) {
    console.error('APOD ERROR:', error)

    title.textContent = 'Unable to load APOD'
    description.textContent =
      'NASA did not return a valid Astronomy Picture of the Day.'
  }
}

function typeText(element, text, speed = 20) {
  element.textContent = ''

  let index = 0

  const cursor = document.createElement('span')
  cursor.textContent = '|'
  cursor.classList.add('typing-cursor')

  element.appendChild(cursor)

  const interval = setInterval(() => {
    if (index < text.length) {
      cursor.before(text[index])
      index++
    } else {
      clearInterval(interval)
    }
  }, speed)
}

setCurrentDate()
getAPOD()
