export interface CreateUpdateComic {
    name: string;
    description: string;
    status: 'ongoing' | 'completed';
    ageRating: '13+' | '16+' | '18+';
    genres: string[];
}