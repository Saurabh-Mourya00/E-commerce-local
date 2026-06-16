import razorpay
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer


# ============================================================
# Standard CRUD ViewSets
# ============================================================

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve product categories."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve products. Supports filtering by category."""
    queryset = Product.objects.select_related('category').all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        in_stock = self.request.query_params.get('in_stock')
        if in_stock is not None:
            queryset = queryset.filter(in_stock=in_stock.lower() == 'true')
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    """List, create, and manage orders for the authenticated user."""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ============================================================
# Razorpay: Create Payment Order
# ============================================================

class CreateRazorpayOrderView(APIView):
    """
    Creates a Razorpay order so the frontend can launch the checkout modal.
    Expects POST body: { "amount": 450 }  (amount in rupees)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            amount = int(request.data.get('amount', 0)) * 100  # Convert ₹ to paise

            if amount <= 0:
                return Response(
                    {"error": "Amount must be greater than 0"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            razorpay_order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1",
            })

            return Response({
                "order_id": razorpay_order['id'],
                "amount": amount,
                "currency": "INR",
            })

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# Razorpay: Verify Payment Signature
# ============================================================

class VerifyRazorpayPaymentView(APIView):
    """
    Verifies the Razorpay payment signature after successful payment.
    Expects POST body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            params = {
                'razorpay_order_id': request.data.get('razorpay_order_id'),
                'razorpay_payment_id': request.data.get('razorpay_payment_id'),
                'razorpay_signature': request.data.get('razorpay_signature'),
            }

            client.utility.verify_payment_signature(params)

            return Response({
                "status": "success",
                "message": "Payment verified successfully",
                "payment_id": params['razorpay_payment_id'],
            })

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"error": "Payment signature verification failed"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# Health Check (useful for verifying server is up)
# ============================================================

class HealthCheckView(APIView):
    """Simple health check endpoint."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "ARMA Store API",
            "version": "1.0.0",
        })
