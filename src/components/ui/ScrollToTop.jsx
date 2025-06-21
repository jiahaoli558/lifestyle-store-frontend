import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          size="sm"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}

export default ScrollToTop

