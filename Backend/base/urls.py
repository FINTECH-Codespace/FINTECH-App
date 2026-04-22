from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('metal_price/',views.metal_price, name='metal_price'),
    path('top_stocks/',views.top_stocks, name='top_stocks'),
    path('stocks/',views.stock_details, name='stocks'),
    path('INstocks/',views.indian_stocks, name='news'),
    path('news/',views.general_news, name='news'),
    path('Silver/',views.silver_price, name='Silver'),
    path('home-loans/', views.home_loan_rates, name='home_loan_rates'),
    path('search/', views.search_stock, name='search_stock'),
]