from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('metal_price/',views.metal_price, name='metal_price'),
    path('top_stocks/',views.top_stocks, name='top_stocks'),
    path('stocks/',views.stock_details, name='stocks'),
    path('INstocks/',views.indian_stocks, name='news'),

]