import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  courseId: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ courseId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') return;
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
      <h4 className="font-medium">Deixe sua avaliação</h4>
      
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Sua nota</label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "w-6 h-6 transition-colors",
                  (hoverRating || rating) > i
                    ? "fill-warning text-warning"
                    : "text-muted-foreground/30"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Seu comentário</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Compartilhe sua experiência com este curso..."
          rows={3}
        />
      </div>

      <Button 
        type="submit" 
        disabled={rating === 0 || comment.trim() === ''}
        className="w-full"
      >
        Enviar Avaliação
      </Button>
    </form>
  );
};
