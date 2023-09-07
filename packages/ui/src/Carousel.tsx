import useEmblaCarousel from 'embla-carousel-react'
import { forwardRef, useCallback, useEffect } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Props {
  slides: string[]
  onIndexSelect: (snap: number) => void
  selectedIndex: number
}

const Carousel = forwardRef<HTMLDivElement, Props>(function Carousel(
  props,
  ref
) {
  const { selectedIndex, slides, onIndexSelect } = props
  const [emblaRef, emblaApi] = useEmblaCarousel()

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    onIndexSelect(emblaApi.selectedScrollSnap())
  }, [emblaApi, onIndexSelect])

  console.log(selectedIndex)
  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.scrollTo(selectedIndex)
  }, [emblaApi, onIndexSelect, onSelect, selectedIndex])

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex touch-pan-y">
        {slides.map((image, i) => (
          <div
            key={image}
            ref={i === selectedIndex ? ref : undefined}
            className="relative min-w-0 flex-[0_0_100%]"
          >
            <div className="relative">
              <img
                className="w-full cursor-grab object-cover active:cursor-grabbing"
                src={image}
                alt=""
              />
              <button
                onClick={scrollPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-3 text-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default Carousel
