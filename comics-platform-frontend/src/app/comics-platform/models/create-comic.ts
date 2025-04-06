export interface CreateComic {
    name: string;
    description: string;
    status: 'ongoing' | 'completed';
    ageRating: '13+' | '15+' | '17+';
    genres: string[];
}