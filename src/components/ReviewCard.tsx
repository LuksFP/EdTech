import React from 'react';
import { Review } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.userAvatar} alt={review.userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {review.userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{review.userName}</h4>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {renderStars(review.rating)}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {review.comment}
      </p>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => onHelpful?.(review.id)}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Útil ({review.helpful})</span>
        </Button>
      </div>
    </div>
  );
};
