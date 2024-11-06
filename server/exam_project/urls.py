from django.contrib import admin
from django.urls import path, include
from exam_app.views import home

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('exam_app.urls')),
    path('', home),
]
