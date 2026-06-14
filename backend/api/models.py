from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    """Product category (e.g., Daily Essentials, Beverages, Masala & Spices)."""
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Emoji or icon name")

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """Grocery product listing."""
    name = models.CharField(max_length=200)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    pack_size = models.CharField(max_length=50, help_text="e.g., 1 kg, 500 ml")
    in_stock = models.BooleanField(default=True)

    # Image field — integrates with Cloudinary via django-cloudinary-storage
    image = models.ImageField(
        upload_to='arma_store/products/',
        blank=True,
        null=True,
        help_text="Product image (uploaded to Cloudinary)",
    )
    # Fallback emoji icon for display when no image is uploaded
    image_icon = models.CharField(max_length=10, blank=True, default='🛒')

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} — ₹{self.price}"


class Order(models.Model):
    """Customer order."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders',
    )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.pk} — {self.user.username} — ₹{self.total_amount}"


class OrderItem(models.Model):
    """Individual item within an order."""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
    )
    product_name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x{self.quantity}"
