import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface EventCardProps {
  title: string
  date: string
  location: string
  price: string
  imageUrl?: string
}

export function EventCard({ title, date, location, price, imageUrl }: EventCardProps) {
  return (
    <Card className="w-full max-w-[350px] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full bg-muted object-cover">
        {/* Placeholder for Image or actual Image component */}
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription>{date} • {location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{price}</div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Comprar Tickets</Button>
      </CardFooter>
    </Card>
  )
}
