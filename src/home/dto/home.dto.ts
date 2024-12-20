export class HomeResponseDto {
  banners: Banner[];
  popularRoutes: Route[];
  featuredDestinations: Destination[];
}

export class FeaturedContentDto {
  routes: Route[];
  destinations: Destination[];
  recommendations: Recommendation[];
}

export class Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

export class Route {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
}

export class Destination {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
}

export class Recommendation {
  id: number;
  title: string;
  content: string;
}
