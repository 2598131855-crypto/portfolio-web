import { createElement, useEffect, useMemo, useRef, useState } from 'react'
import './TextType.css'

export default function TextType({
  text,
  texts,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  startOnVisible = false,
  reverseMode = false,
  onSentenceComplete,
  ...props
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)
  const containerRef = useRef(null)
  const completedTextRef = useRef(null)

  const textArray = useMemo(() => {
    const value = texts ?? text ?? ''
    return Array.isArray(value) ? value : [value]
  }, [text, texts])

  const speedRange = variableSpeed ?? (variableSpeedEnabled ? { min: variableSpeedMin, max: variableSpeedMax } : null)

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setIsVisible(true)
      })
    }, { threshold: 0.1 })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!isVisible || !textArray.length) return undefined

    let timeout
    const currentText = textArray[currentTextIndex] ?? ''
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText
    const randomSpeed = speedRange
      ? Math.random() * (speedRange.max - speedRange.min) + speedRange.min
      : typingSpeed

    if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false)
        if (currentTextIndex === textArray.length - 1 && !loop) return undefined
        onSentenceComplete?.(textArray[currentTextIndex], currentTextIndex)
        setCurrentTextIndex((index) => (index + 1) % textArray.length)
        setCurrentCharIndex(0)
      } else {
        timeout = window.setTimeout(() => {
          setDisplayedText((value) => value.slice(0, -1))
        }, deletingSpeed)
      }
    } else if (currentCharIndex < processedText.length) {
      const delay = currentCharIndex === 0 && displayedText === '' ? initialDelay : randomSpeed
      timeout = window.setTimeout(() => {
        setDisplayedText((value) => value + processedText[currentCharIndex])
        setCurrentCharIndex((index) => index + 1)
      }, delay)
    } else if (!loop && currentTextIndex === textArray.length - 1) {
      const completionKey = `${currentTextIndex}:${currentText}`
      if (completedTextRef.current !== completionKey) {
        completedTextRef.current = completionKey
        onSentenceComplete?.(textArray[currentTextIndex], currentTextIndex)
      }
      return undefined
    } else {
      timeout = window.setTimeout(() => setIsDeleting(true), pauseDuration)
    }

    return () => window.clearTimeout(timeout)
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    speedRange,
    textArray,
    typingSpeed,
  ])

  const shouldHideCursor = hideCursorWhileTyping && (currentCharIndex < (textArray[currentTextIndex] ?? '').length || isDeleting)
  const color = textColors.length ? textColors[currentTextIndex % textColors.length] : 'inherit'

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`.trim(),
      ...props,
    },
    <span className="text-type__content" style={{ color }}>{displayedText}</span>,
    showCursor && (
      <span
        className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`.trim()}
        style={{ '--cursor-blink-duration': `${cursorBlinkDuration}s` }}
      >
        {cursorCharacter}
      </span>
    ),
  )
}
