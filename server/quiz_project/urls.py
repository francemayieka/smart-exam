from django.contrib import admin
from django.urls import path, include
from quiz_app.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('quiz_app.urls')),
    path('', home),
]
