from django.core.management.base import BaseCommand
from api.models import Category


class Command(BaseCommand):
    help = 'Seed the default product categories into the database'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Daily Essentials', 'icon': '🌾'},
            {'name': 'Beverages & Drinks', 'icon': '🥤'},
            {'name': 'Masala & Spices', 'icon': '🌶️'},
            {'name': 'Snacks & Bakery', 'icon': '🍫'},
            {'name': 'Dairy & Eggs', 'icon': '🧀'},
            {'name': 'Fruits & Vegetables', 'icon': '🍎'},
            {'name': 'Bulk Items', 'icon': '📦'},
        ]

        created_count = 0
        for cat_data in categories:
            _, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'icon': cat_data['icon']},
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'  Created: {cat_data["icon"]} {cat_data["name"]}'))
            else:
                self.stdout.write(f'  Already exists: {cat_data["icon"]} {cat_data["name"]}')

        self.stdout.write(self.style.SUCCESS(f'\nDone! {created_count} new categories created.'))
