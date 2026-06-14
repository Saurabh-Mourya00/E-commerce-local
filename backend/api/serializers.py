from rest_framework import serializers
from .models import Category, Product, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'category', 'category_name',
            'price', 'pack_size', 'in_stock', 'image', 'image_icon',
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_amount', 'status',
            'razorpay_order_id', 'razorpay_payment_id',
            'created_at', 'updated_at', 'items',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
