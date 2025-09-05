import { ComicItem } from "./comic-item";

export interface ComicSingleItem extends ComicItem {
    description: string;
    status: 'ongoing' | 'completed';
    ageRating: '13+' | '16+' | '18+';
    createdAt: string;
    user: string;
    genres: string[];
}