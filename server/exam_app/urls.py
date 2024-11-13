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
    path('search-course/', views.search_course, name='search_course'),

    # Updated to include most non-special characters
    # re_path(r'^search-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.search_course, name='search_course'),
    re_path(r'^update-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.update_course, name='update_course'),
    re_path(r'^delete-course/(?P<course_code>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.delete_course, name='delete_course'),

    path('add-exam/', views.add_exam_view, name='add_exam'),
    path('list-exams/', views.list_exams_view, name='list_exams'),
    # path('search-exam/', views.search_exams_view, name='search_exam'),
    path('search-exams/', views.search_exams_view, name='search_exams'),
    re_path(r'^update-exam/(?P<exam_name>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.update_exam_view, name='update_exam'),
    re_path(r'^delete-exam/(?P<exam_name>[\w\-\.\@\s\/\(\)\&\+\*]+)/$', views.delete_exam_view, name='delete_exam'),
    path('generate-exam/', views.generate_exam_and_marking_scheme_view, name='generate_exam_and_marking_scheme'),
    # path('generate-exam/', views.generate_exam_view, name='generate_exam'),
    # path('generate-marking-scheme/', views.generate_marking_scheme_view, name='generate_marking_scheme'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
