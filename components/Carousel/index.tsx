import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import { EmblaOptionsType } from "embla-carousel"

export default function CarouselComponent() {
  const [embelaRef, embelaApi] = useEmblaCarousel({ loop: true })
  return (
    <div>
      <Carousel>
        <CarouselContent className="ml-1">
          <CarouselItem>
            <Image
              alt="image"
              src="/assets/freddy.jpg"
              width={300}
              height={300}
            ></Image>
          </CarouselItem>
          <CarouselItem>
            <Image
              alt="image"
              src="/assets/getoutcover.jpg"
              width={300}
              height={300}
            ></Image>
          </CarouselItem>
          <CarouselItem>
            <Image
              alt="image"
              src="/assets/shining.jpg"
              width={300}
              height={300}
            ></Image>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
