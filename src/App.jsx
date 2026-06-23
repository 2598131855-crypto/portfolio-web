import { useEffect, useRef, useState } from 'react'

const menuItems = [
  {
    id: '01',
    title: 'ABOUT ME',
    subtitle: 'Profile & biography',
    href: '#about',
    image: '/images/content-about-v2.jpg',
  },
  {
    id: '02',
    title: 'DESIGN WORKS',
    subtitle: 'Visual design & narrative',
    href: '#design-works',
    image: '/images/content-design-v2.jpg',
  },
  {
    id: '03',
    title: 'PLASTIC WORKS',
    subtitle: 'Sculpture & drawing',
    href: '#plastic-works',
    image: '/images/content-sculpture-v2.jpg',
  },
  {
    id: '04',
    title: 'DIGITAL WORKS',
    subtitle: 'Image, particles & motion',
    href: '#digital-works',
    image: '/images/content-digital-v3.png',
  },
]

const designBookPages = [
  '/images/design-book-01.jpg',
  '/images/design-book-02.webp',
  '/images/design-book-03.webp',
  '/images/design-book-04.jpg',
  '/images/design-book-05.jpg',
]

const plasticWorks = [
  { image: '/images/plastic-work-01.jpg', title: 'PLASTER STUDY', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-02.jpg', title: 'SEATED FIGURE', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-03.jpg', title: 'PORTRAIT STUDY I', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-04.jpg', title: 'OBJECTS & LIGHT', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-05.jpg', title: 'THE WORKER', medium: 'Oil on canvas' },
  { image: '/images/plastic-work-06.jpg', title: 'PORTRAIT STUDY II', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-07.jpg', title: 'WATERSIDE', medium: 'Oil on canvas' },
  { image: '/images/plastic-work-08.jpg', title: 'SEATED PORTRAIT', medium: 'Pencil on paper' },
  { image: '/images/plastic-work-09.jpg', title: 'TREES IN SHADOW', medium: 'Charcoal on paper' },
  { image: '/images/plastic-work-10.jpg', title: 'INTERIOR', medium: 'Oil on canvas' },
]

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function PortfolioTail() {
  const tailRef = useRef(null)
  const markRef = useRef(null)

  const handlePointerMove = (event) => {
    const tail = tailRef.current
    const mark = markRef.current
    if (!tail || !mark) return

    const bounds = tail.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))

    tail.style.setProperty('--tail-x', `${(x * 100).toFixed(1)}%`)
    tail.style.setProperty('--tail-y', `${(y * 100).toFixed(1)}%`)
    mark.style.setProperty('--mark-x', `${((x - .5) * 18).toFixed(2)}px`)
    mark.style.setProperty('--mark-y', `${((y - .5) * 12).toFixed(2)}px`)
  }

  const resetPointer = () => {
    const tail = tailRef.current
    const mark = markRef.current
    tail?.style.setProperty('--tail-x', '24%')
    tail?.style.setProperty('--tail-y', '16%')
    mark?.style.setProperty('--mark-x', '0px')
    mark?.style.setProperty('--mark-y', '0px')
  }

  return (
    <section
      className="portfolio-tail"
      id="contact"
      ref={tailRef}
      data-page-scene
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="page-transition-sweep page-transition-sweep-dark" aria-hidden="true" />
      <div className="tail-beams" aria-hidden="true" />
      <a className="tail-menu-button" href="#menu">
        <span>CONTENTS</span>
        <b>+</b>
      </a>

      <h2 className="tail-mark" ref={markRef} data-reveal>Bev.</h2>

      <p className="tail-statement" data-reveal>
        Turning observation into<br />
        <strong>visible form.</strong>
      </p>

      <div className="tail-columns" data-reveal>
        <div>
          <span>PRACTICE</span>
          <a href="#menu">Visual Design</a>
          <a href="#menu">Image Making</a>
          <a href="#menu">Form Studies</a>
          <a href="#menu">Digital Experiments</a>
        </div>
        <div>
          <span>QUICK LINKS</span>
          <a href="#home">Home</a>
          <a href="#menu">Contents</a>
          <a href="#about">About Me</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <span>CONTACT</span>
          <p>Beijing, China</p>
          <a href="mailto:jingjingtian855@gmail.com">jingjingtian855@gmail.com</a>
          <p>Open to new ideas<br />and creative exchange.</p>
        </div>
        <div>
          <span>STATUS</span>
          <p>Portfolio 2021—2026</p>
          <p>Visual design<br />image & form</p>
        </div>
      </div>

      <div className="tail-bottom">
        <span>© 2026 BEVERLY BRENNAN</span>
        <span>PORTFOLIO / 2021—2026</span>
        <a href="#home">BACK TO TOP ↑</a>
      </div>
    </section>
  )
}

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [introStage, setIntroStage] = useState('loading')
  const [heroScene, setHeroScene] = useState('construction')
  const [peelOffset, setPeelOffset] = useState({ x: 0, y: 0 })
  const [isPeeling, setIsPeeling] = useState(false)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [isMapDragging, setIsMapDragging] = useState(false)
  const dragState = useRef(null)
  const returnDragState = useRef(null)
  const revealTimer = useRef(null)
  const tapeMessage = 'I am Beverly Brennan · Welcome to my website'

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      setIntroStage('done')
      return undefined
    }

    document.body.classList.add('intro-locked')
    const startedAt = performance.now()
    const duration = 1350
    let animationFrame
    let leaveTimer
    let finishTimer

    const charge = (now) => {
      const elapsed = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 2.2)
      setLoadingProgress(Math.min(100, Math.floor(eased * 100)))

      if (elapsed < 1) {
        animationFrame = window.requestAnimationFrame(charge)
        return
      }

      setLoadingProgress(100)
      leaveTimer = window.setTimeout(() => setIntroStage('leaving'), 180)
      finishTimer = window.setTimeout(() => {
        setIntroStage('done')
        document.body.classList.remove('intro-locked')
      }, 760)
    }

    animationFrame = window.requestAnimationFrame(charge)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(leaveTimer)
      window.clearTimeout(finishTimer)
      document.body.classList.remove('intro-locked')
    }
  }, [])

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.hasAttribute('data-scroll-reveal')) {
            entry.target.classList.toggle('is-visible', entry.isIntersecting)
            return
          }

          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.14 },
    )

    revealItems.forEach((item) => observer.observe(item))

    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(height > 0 ? window.scrollY / height : 0)

      const viewportHeight = window.innerHeight
      document.querySelectorAll('[data-page-scene]').forEach((scene) => {
        const bounds = scene.getBoundingClientRect()
        const enter = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight * .72)))
        const exit = Math.max(0, Math.min(1, -bounds.top / (viewportHeight * .72)))
        const opacity = Math.max(.12, enter * (1 - exit * .58))
        const translateY = (1 - enter) * 76 - exit * 46
        const blur = (1 - enter) * 11 + exit * 7
        const scale = .972 + enter * .028 - exit * .012

        scene.style.setProperty('--scene-enter', enter.toFixed(3))
        scene.style.setProperty('--scene-exit', exit.toFixed(3))
        scene.style.setProperty('--scene-opacity', opacity.toFixed(3))
        scene.style.setProperty('--scene-y', `${translateY.toFixed(2)}px`)
        scene.style.setProperty('--scene-blur', `${blur.toFixed(2)}px`)
        scene.style.setProperty('--scene-scale', scale.toFixed(4))
        scene.style.setProperty('--scene-clip', `${((1 - enter) * 100).toFixed(2)}%`)
        scene.style.setProperty('--scene-sweep-y', `${(-enter * 112).toFixed(2)}%`)
      })

      const menuSection = document.querySelector('#menu')
      const menuImages = document.querySelectorAll('.menu-card-image')
      if (menuSection && menuImages.length) {
        const menuBounds = menuSection.getBoundingClientRect()
        const travel = Math.max(280, window.innerHeight * .5)
        const exitProgress = Math.max(0, Math.min(1, -menuBounds.top / travel))
        const delayedProgress = Math.max(0, Math.min(1, (exitProgress - .38) / .62))

        menuImages.forEach((image) => {
          image.style.setProperty('--dissolve-progress', delayedProgress.toFixed(3))
          image.style.setProperty('--edge-start', `${(100 - delayedProgress * 42).toFixed(1)}%`)
        })
      }

      const graphicSection = document.querySelector('#design-works')
      const graphicTrack = graphicSection?.querySelector('.graphic-chapter-track')
      if (graphicSection && graphicTrack) {
        const trackWidth = graphicTrack.scrollWidth
        const horizontalTravel = Math.max(0, trackWidth - window.innerWidth)
        const sectionHeight = viewportHeight + horizontalTravel
        graphicSection.style.height = `${sectionHeight}px`

        const graphicBounds = graphicSection.getBoundingClientRect()
        const horizontalProgress = horizontalTravel > 0
          ? Math.max(0, Math.min(1, -graphicBounds.top / horizontalTravel))
          : 0

        graphicTrack.style.setProperty('--graphic-x', `${(-horizontalTravel * horizontalProgress).toFixed(2)}px`)
        graphicSection.style.setProperty('--graphic-progress', horizontalProgress.toFixed(3))
      }

      const bookSection = document.querySelector('#design-book')
      const bookPages = bookSection?.querySelectorAll('.design-book-page')
      if (bookSection && bookPages?.length) {
        const pageCount = bookPages.length
        const bookTravel = viewportHeight * (pageCount - 1) * .95
        bookSection.style.height = `${viewportHeight + bookTravel}px`

        const bookBounds = bookSection.getBoundingClientRect()
        const bookProgress = bookTravel > 0
          ? Math.max(0, Math.min(1, -bookBounds.top / bookTravel))
          : 0
        const pageProgress = bookProgress * (pageCount - 1)
        const currentPage = Math.min(pageCount, Math.floor(pageProgress + .5) + 1)

        bookSection.style.setProperty('--book-progress', bookProgress.toFixed(3))
        bookSection.querySelector('.design-book-current')?.replaceChildren(String(currentPage).padStart(2, '0'))

        bookPages.forEach((page, index) => {
          const turn = Math.max(0, Math.min(1, pageProgress - index))
          const easedTurn = turn * turn * (3 - 2 * turn)
          const fold = Math.sin(Math.PI * turn)
          page.style.setProperty('--book-angle', `${(-178 * easedTurn).toFixed(2)}deg`)
          page.style.setProperty('--book-lift', `${(-14 * fold).toFixed(2)}px`)
          page.style.setProperty('--book-fold', fold.toFixed(3))
        })
      }

      const plasticSection = document.querySelector('#plastic-works')
      const plasticRing = plasticSection?.querySelector('.plastic-cylinder-ring')
      const plasticPanels = plasticSection?.querySelectorAll('.plastic-cylinder-panel')
      if (plasticSection && plasticRing && plasticPanels?.length) {
        const plasticTravel = viewportHeight * 3.15
        plasticSection.style.height = `${viewportHeight + plasticTravel}px`

        const plasticBounds = plasticSection.getBoundingClientRect()
        const plasticProgress = Math.max(0, Math.min(1, -plasticBounds.top / plasticTravel))
        const rotation = plasticProgress * -(360 - 360 / plasticPanels.length)
        const activeIndex = Math.round(plasticProgress * (plasticPanels.length - 1)) % plasticPanels.length

        plasticSection.style.setProperty('--plastic-progress', plasticProgress.toFixed(3))
        plasticRing.style.setProperty('--plastic-rotation', `${rotation.toFixed(2)}deg`)
        plasticSection.querySelector('.plastic-cylinder-current')?.replaceChildren(String(activeIndex + 1).padStart(2, '0'))

        plasticPanels.forEach((panel, index) => {
          const rawAngle = (index * (360 / plasticPanels.length) + rotation) % 360
          const frontDistance = Math.abs(((rawAngle + 540) % 360) - 180)
          const focus = Math.max(0, 1 - frontDistance / 112)
          panel.style.setProperty('--panel-focus', focus.toFixed(3))
          panel.classList.toggle('is-front', frontDistance < 20)
        })
      }
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  useEffect(() => () => window.clearTimeout(revealTimer.current), [])

  const completePeel = () => {
    if (heroScene !== 'construction') return

    dragState.current = null
    setIsPeeling(false)
    setPeelOffset({ x: window.innerWidth * 0.72, y: -window.innerHeight * 0.62 })
    setHeroScene('dissolving')

    revealTimer.current = window.setTimeout(() => setHeroScene('map'), 900)
  }

  const handlePeelStart = (event) => {
    if (heroScene !== 'construction') return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = { x: event.clientX, y: event.clientY }
    setIsPeeling(true)
  }

  const handlePeelMove = (event) => {
    if (!dragState.current || heroScene !== 'construction') return

    const x = event.clientX - dragState.current.x
    const y = event.clientY - dragState.current.y
    setPeelOffset({ x, y })

    if (Math.hypot(x, y) > 220 && (x > 70 || y < -70)) completePeel()
  }

  const handlePeelEnd = (event) => {
    if (!dragState.current) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragState.current = null
    setIsPeeling(false)
    setPeelOffset({ x: 0, y: 0 })
  }

  const handlePeelKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      completePeel()
    }
  }

  const showConstruction = () => {
    window.clearTimeout(revealTimer.current)
    dragState.current = null
    returnDragState.current = null
    setIsPeeling(false)
    setIsMapDragging(false)
    setPeelOffset({ x: 0, y: 0 })
    setMapOffset({ x: 0, y: 0 })
    setHeroScene('construction')
  }

  const completeReturn = () => {
    if (heroScene !== 'map') return

    returnDragState.current = null
    setIsMapDragging(false)
    setPeelOffset({ x: 0, y: 0 })
    setMapOffset({ x: -window.innerWidth * 0.34, y: window.innerHeight * 0.28 })
    setHeroScene('restoring')

    revealTimer.current = window.setTimeout(() => {
      setMapOffset({ x: 0, y: 0 })
      setHeroScene('construction')
    }, 820)
  }

  const handleMapStart = (event) => {
    if (heroScene !== 'map' || event.target.closest('a')) return

    event.currentTarget.setPointerCapture(event.pointerId)
    returnDragState.current = { x: event.clientX, y: event.clientY }
    setIsMapDragging(true)
  }

  const handleMapMove = (event) => {
    if (!returnDragState.current || heroScene !== 'map') return

    const x = event.clientX - returnDragState.current.x
    const y = event.clientY - returnDragState.current.y
    setMapOffset({ x, y })

    if (Math.hypot(x, y) > 220 && (x < -70 || y > 70)) completeReturn()
  }

  const handleMapEnd = (event) => {
    if (!returnDragState.current) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    returnDragState.current = null
    setIsMapDragging(false)
    setMapOffset({ x: 0, y: 0 })
  }

  const handleMapKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      completeReturn()
    }
  }

  const handlePlasticPointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - .5
    const y = (event.clientY - bounds.top) / bounds.height - .5
    event.currentTarget.style.setProperty('--plastic-pointer-rotate', `${(x * 10).toFixed(2)}deg`)
    event.currentTarget.style.setProperty('--plastic-pointer-tilt', `${(-5 - y * 4).toFixed(2)}deg`)
  }

  const resetPlasticPointer = (event) => {
    event.currentTarget.style.setProperty('--plastic-pointer-rotate', '0deg')
    event.currentTarget.style.setProperty('--plastic-pointer-tilt', '-5deg')
  }

  return (
    <main>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      {introStage !== 'done' && (
        <div
          className={`intro-screen ${introStage === 'leaving' ? 'is-leaving' : ''}`}
          aria-live="polite"
          aria-label={`Loading ${loadingProgress} percent`}
        >
          <span className="intro-digit">
            {String(loadingProgress).padStart(3, '0')}<small>%</small>
          </span>
        </div>
      )}

      <section
        className={`hero hero-editorial hero-interactive hero-scene-${heroScene} ${introStage === 'done' ? 'hero-ready' : ''}`}
        id="home"
      >
        <header className="nav hero-nav shell">
          <a className="wordmark hero-wordmark" href="#home" aria-label="返回首页" onClick={showConstruction}>
            Beverly Brennan<span>®</span>
          </a>
          <nav aria-label="主导航">
            <a href="#home" onClick={showConstruction}>HOME</a>
            <a href="#about">ABOUT ME</a>
            <a href="#design-works">DESIGN WORKS</a>
            <a href="#plastic-works">PLASTIC WORKS</a>
            <a href="#digital-works">DIGITAL WORKS</a>
          </nav>
        </header>

        <div
          className={`final-map-layer ${isMapDragging ? 'is-dragging' : ''}`}
          style={{
            '--map-x': `${mapOffset.x}px`,
            '--map-y': `${mapOffset.y}px`,
            '--map-rotate': `${Math.max(-8, Math.min(8, mapOffset.x / 80))}deg`,
          }}
          role="button"
          tabIndex={heroScene === 'map' ? 0 : -1}
          aria-label="向左下拖动返回胶带页面"
          aria-hidden={heroScene !== 'map'}
          onPointerDown={handleMapStart}
          onPointerMove={handleMapMove}
          onPointerUp={handleMapEnd}
          onPointerCancel={handleMapEnd}
          onKeyDown={handleMapKey}
        >
          <div className="final-map-heading">
            <strong>04 / PORTFOLIO</strong>
          </div>
          <img src="/images/hero-map-pattern.webp" alt="作品集四个章节的流程图" draggable="false" />
          <span className="map-return-instruction">DRAG DOWN LEFT TO RETURN</span>
          <a className="final-map-arrow" href="#menu" aria-label="前往目录页">
            <Arrow />
          </a>
        </div>

        <div className="construction-layer" aria-hidden={heroScene === 'map'}>
          <div className="construction-card">
            <div className="construction-meta">
              <strong>PORTFOLIO</strong>
              <span>VISUAL DESIGN / BEIJING</span>
              <span>PORTFOLIO 2021—2026</span>
            </div>

            <div className="construction-message">
              <span>I am</span>
              <strong>Beverly Brennan</strong>
              <span>Welcome to my website</span>
            </div>

            <p className="peel-instruction">DRAG THE TAPE UP ...</p>

            <div
              className={`tape-cluster ${isPeeling ? 'is-dragging' : ''}`}
              style={{
                '--peel-x': `${peelOffset.x}px`,
                '--peel-y': `${peelOffset.y}px`,
                '--peel-rotate': `${Math.max(-14, Math.min(18, peelOffset.x / 24))}deg`,
              }}
              role="button"
              tabIndex={heroScene === 'construction' ? 0 : -1}
              aria-label="拖动撕开胶带进入作品集"
              onPointerDown={handlePeelStart}
              onPointerMove={handlePeelMove}
              onPointerUp={handlePeelEnd}
              onPointerCancel={handlePeelEnd}
              onKeyDown={handlePeelKey}
            >
              {[1, 2, 3, 4].map((tape) => (
                <div className={`tape-strip tape-strip-${tape}`} key={tape}>
                  <div className="tape-copy">
                    <span>{tapeMessage}</span>
                    <span>{tapeMessage}</span>
                    <span>{tapeMessage}</span>
                  </div>
                </div>
              ))}
              <span className="peel-handle">PEEL <Arrow diagonal /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="menu-section page-scroll-scene" id="menu" data-page-scene>
        <div className="page-transition-sweep" aria-hidden="true" />
        <div className="shell">
          <header className="menu-nav">
            <a className="wordmark hero-wordmark" href="#home" aria-label="Back to home">
              Beverly Brennan<span>&reg;</span>
            </a>
            <nav aria-label="Contents navigation">
              <a href="#home">HOME</a>
              <a href="#about">ABOUT ME</a>
              <a href="#design-works">DESIGN WORKS</a>
              <a href="#plastic-works">PLASTIC WORKS</a>
              <a href="#digital-works">DIGITAL WORKS</a>
            </nav>
          </header>

          <div className="menu-top" data-reveal data-scroll-reveal>
            <h2>CONTENTS</h2>
            <p>
              Four chapters form this portfolio. Select a direction to enter,
              or keep scrolling to browse the complete story.
            </p>
          </div>

          <div className="menu-grid">
            {menuItems.map((item) => (
              <a className="menu-card" href={item.href} key={item.id} data-reveal data-scroll-reveal>
                <span className="menu-card-index">{item.id}</span>
                <div className="menu-card-image" style={{ '--menu-image': `url("${item.image}")` }}>
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="about-profile page-scroll-scene" id="about" data-page-scene>
        <div className="page-transition-sweep page-transition-sweep-paper" aria-hidden="true" />
        <div className="shell">
          <header className="menu-nav about-nav">
            <a className="wordmark hero-wordmark" href="#home" aria-label="Back to home">
              Beverly Brennan<span>&reg;</span>
            </a>
            <nav aria-label="About navigation">
              <a href="#home">HOME</a>
              <a href="#about">ABOUT ME</a>
              <a href="#design-works">DESIGN WORKS</a>
              <a href="#plastic-works">PLASTIC WORKS</a>
              <a href="#digital-works">DIGITAL WORKS</a>
            </nav>
          </header>

          <div className="about-profile-grid">
            <div className="about-profile-title">
              <span>01 / PERSONAL PROFILE</span>
              <h2>ABOUT<br />ME</h2>
              <p>Visual design, image making<br />and digital experiments.</p>
            </div>

            <div className="about-profile-copy">
              <div className="about-name-row">
                <p>田京京</p>
                <span>Beverly Brennan</span>
              </div>
              <h3>中国传媒大学<br /><em>在读</em></h3>
              <p className="about-profile-intro">
                我关注视觉叙事、图像与形态之间的关系，喜欢把日常观察与生活经验，
                转化为克制但有张力的视觉表达。
              </p>

              <div className="about-interests">
                <span className="about-interests-label">INTERESTS / 悬停查看</span>
                <div className="about-interest-list">
                  <span className="about-interest about-interest-rock" tabIndex="0">
                    摇滚
                    <img src="/images/about-rock.png" alt="两把贝斯与琴包" />
                  </span>
                  <span className="about-interest about-interest-cycling" tabIndex="0">
                    骑行
                    <img src="/images/about-cycling.png" alt="公路自行车" />
                  </span>
                  <span className="about-interest about-interest-calligraphy" tabIndex="0">
                    书法
                    <img src="/images/about-calligraphy.png" alt="书法作品" />
                  </span>
                </div>
              </div>
            </div>

            <div className="about-portrait-block">
              <div className="about-portrait-frame">
                <img src="/images/content-about-v2.jpg" alt="田京京个人照片" />
              </div>
              <div className="about-profile-details">
                <span>BASED IN</span><strong>BEIJING, CHINA</strong>
                <span>CONTACT</span><a href="mailto:jingjingtian855@gmail.com">jingjingtian855@gmail.com</a>
                <span>STATUS</span><strong>STUDENT / DESIGNER</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="graphic-chapter" id="design-works">
        <div className="graphic-chapter-sticky">
          <div className="graphic-chapter-track">
            <img
              src="/images/design-works-spread.webp"
              alt="平面作品章节：虚实交汇，本真共在"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="design-book" id="design-book">
        <div className="design-book-sticky">
          <header className="menu-nav design-book-nav shell">
            <a className="wordmark hero-wordmark" href="#home" aria-label="Back to home">
              Beverly Brennan<span>&reg;</span>
            </a>
            <nav aria-label="Design works navigation">
              <a href="#home">HOME</a>
              <a href="#about">ABOUT ME</a>
              <a href="#design-works">DESIGN WORKS</a>
              <a href="#plastic-works">PLASTIC WORKS</a>
              <a href="#digital-works">DIGITAL WORKS</a>
            </nav>
          </header>

          <div className="design-book-meta">
            <span>02 / DESIGN WORKS</span>
            <span><b className="design-book-current">01</b> / {String(designBookPages.length).padStart(2, '0')}</span>
          </div>

          <div className="design-book-stage">
            <div className="design-book-spine" aria-hidden="true" />
            <div className="design-book-pages">
              {designBookPages.map((page, index) => (
                <figure
                  className="design-book-page"
                  key={page}
                  style={{ zIndex: designBookPages.length - index }}
                >
                  <img
                    src={page}
                    alt={`平面作品展示第 ${index + 1} 页`}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    draggable="false"
                  />
                </figure>
              ))}
            </div>
          </div>

          <p className="design-book-hint">SCROLL TO TURN THE PAGES</p>
        </div>
      </section>

      <section
        className="plastic-cylinder-section"
        id="plastic-works"
        onPointerMove={handlePlasticPointerMove}
        onPointerLeave={resetPlasticPointer}
      >
        <div className="plastic-cylinder-sticky">
          <div className="plastic-room-background" aria-hidden="true" />

          <header className="menu-nav plastic-cylinder-nav shell">
            <a className="wordmark hero-wordmark" href="#home" aria-label="Back to home">
              Beverly Brennan<span>&reg;</span>
            </a>
            <nav aria-label="Plastic works navigation">
              <a href="#home">HOME</a>
              <a href="#about">ABOUT ME</a>
              <a href="#design-works">DESIGN WORKS</a>
              <a href="#plastic-works">PLASTIC WORKS</a>
              <a href="#digital-works">DIGITAL WORKS</a>
            </nav>
          </header>

          <div className="plastic-cylinder-meta">
            <div>
              <span>03 / PLASTIC WORKS</span>
              <h2>FORM<br />STUDIES</h2>
            </div>
            <p><b className="plastic-cylinder-current">01</b> / {String(plasticWorks.length).padStart(2, '0')}</p>
          </div>

          <div className="plastic-cylinder-viewport">
            <div className="plastic-cylinder-ring">
              {plasticWorks.map((work, index) => (
                <figure
                  className="plastic-cylinder-panel"
                  key={work.image}
                  style={{ '--panel-angle': `${index * (360 / plasticWorks.length)}deg` }}
                >
                  <div className="plastic-cylinder-frame">
                    <img src={work.image} alt={work.title} loading={index < 3 ? 'eager' : 'lazy'} draggable="false" />
                  </div>
                  <figcaption>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{work.title}</strong>
                    <small>{work.medium}</small>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <p className="plastic-cylinder-hint">SCROLL TO ROTATE / MOVE TO SHIFT VIEW</p>
        </div>
      </section>

      <PortfolioTail />
    </main>
  )
}

export default App
