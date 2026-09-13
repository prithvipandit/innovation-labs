import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RichText from '@/components/RichText';

export default function ProductDetailsDialog({ product, open, onOpenChange }) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto" data-testid="product-details-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-[#2D3436]">{product.name}</DialogTitle>
        </DialogHeader>
        <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover rounded-2xl" />
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#FF6B6B]">₹{product.price}</span>
          <span className={`text-sm font-semibold ${(product.stock ?? 0) > 0 ? 'text-[#2D6A31]' : 'text-red-600'}`}>
            {(product.stock ?? 0) > 0 ? `${product.stock} in stock` : 'Currently unavailable'}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-[#FFD93D]/20 text-[#2D3436] font-medium">{product.category}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-[#6BCB77]/20 text-[#2D3436] font-medium">Ages {product.age_group}</span>
        </div>
        <RichText text={product.description} className="text-[#636E72]" />
      </DialogContent>
    </Dialog>
  );
}
