from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # ViewSet routes
    path('', include(router.urls)),

    # Razorpay payment
    path('create-order/', views.CreateRazorpayOrderView.as_view(), name='create-razorpay-order'),
    path('verify-payment/', views.VerifyRazorpayPaymentView.as_view(), name='verify-razorpay-payment'),

    # Health check
    path('health/', views.HealthCheckView.as_view(), name='health-check'),
]
