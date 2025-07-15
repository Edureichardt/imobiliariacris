'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true)

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => window.removeEventListener('load', handleLoad)
  }, [])

  // Animação dos dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? '' : prev + '.'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  if (isLoaded) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-bl from-green-900 to-black backdrop-blur-sm">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        {/* Círculo girando */}
        <div className="absolute w-full h-full rounded-full border-4 border-white border-t-transparent animate-spin"></div>

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Logo CA Imóveis"
          width={160}
          height={160}
          className="z-10"
        />
      </div>

      {/* Texto com animação fade pulse e dots */}
      <p className="mt-6 text-white text-lg font-semibold select-none animate-pulse">
        Carregando aplicações{dots}
      </p>
    </div>
  )
}

export default Preloader
