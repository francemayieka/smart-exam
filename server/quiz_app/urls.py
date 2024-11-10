from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('add-course/', views.add_course, name='add_course'),
    path('list-courses/', views.list_courses, name='list_courses'),
    # Updated to include most non-special characters
    re_path(r'^search-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.search_course, name='search_course'),
    re_path(r'^update-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.update_course, name='update_course'),
    re_path(r'^delete-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.delete_course, name='delete_course'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
