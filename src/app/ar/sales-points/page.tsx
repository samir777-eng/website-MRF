"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation,
  Search,
  Store,
  CheckCircle2
} from 'lucide-react';

const SALES_POINTS = [
  {
    id: '1',
    name: 'مكتبة النور',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    address: 'شارع عباس العقاد، مدينة نصر',
    phone: '01234567890',
    hours: 'السبت - الخميس: 9 ص - 9 م',
    verified: true,
    lat: 30.0444,
    lng: 31.2357,
  },
  {
    id: '2',
    name: 'مكتبة الفاروق',
    governorate: 'الجيزة',
    city: 'المهندسين',
    address: 'شارع جامعة الدول العربية، المهندسين',
    phone: '01234567891',
    hours: 'السبت - الخميس: 10 ص - 10 م',
    verified: true,
    lat: 30.0626,
    lng: 31.2081,
  },
  {
    id: '3',
    name: 'مكتبة العلم والإيمان',
    governorate: 'الإسكندرية',
    city: 'سموحة',
    address: 'شارع فوزي معاذ، سموحة',
    phone: '01234567892',
    hours: 'السبت - الخميس: 9 ص - 8 م',
    verified: true,
    lat: 31.2001,
    lng: 29.9187,
  },
  {
    id: '4',
    name: 'مكتبة الرسالة',
    governorate: 'القاهرة',
    city: 'مصر الجديدة',
    address: 'شارع الحجاز، مصر الجديدة',
    phone: '01234567893',
    hours: 'السبت - الخميس: 9 ص - 9 م',
    verified: true,
    lat: 30.0876,
    lng: 31.3266,
  },
  {
    id: '5',
    name: 'مكتبة المعرفة',
    governorate: 'الجيزة',
    city: 'الهرم',
    address: 'شارع الهرم، الهرم',
    phone: '01234567894',
    hours: 'السبت - الخميس: 10 ص - 10 م',
    verified: true,
    lat: 29.9870,
    lng: 31.1768,
  },
  {
    id: '6',
    name: 'مكتبة الأمل',
    governorate: 'القاهرة',
    city: 'التجمع الخامس',
    address: 'التجمع الخامس، القاهرة الجديدة',
    phone: '01234567895',
    hours: 'السبت - الخميس: 9 ص - 9 م',
    verified: true,
    lat: 30.0131,
    lng: 31.4286,
  },
];

export default function SalesPointsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('all');

  const filteredPoints = SALES_POINTS.filter(point => {
    const matchesSearch = point.name.includes(searchQuery) || 
                         point.city.includes(searchQuery) ||
                         point.address.includes(searchQuery);
    const matchesGovernorate = selectedGovernorate === 'all' || point.governorate === selectedGovernorate;
    return matchesSearch && matchesGovernorate;
  });

  const governorates = Array.from(new Set(SALES_POINTS.map(p => p.governorate)));

  return (
    <div className="min-h-screen page-bg-green" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">منافذ البيع</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اعثر على أقرب منفذ بيع لشراء كتب ومنتجات الأستاذ رضا الفاروق
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{SALES_POINTS.length}</div>
              <div className="text-sm text-muted-foreground">منفذ بيع</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{governorates.length}</div>
              <div className="text-sm text-muted-foreground">محافظة</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">منافذ موثقة</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن منفذ بيع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pe-10"
                />
              </div>
              <select
                value={selectedGovernorate}
                onChange={(e) => setSelectedGovernorate(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">جميع المحافظات</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950 dark:to-blue-950 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold mb-2">خريطة منافذ البيع</p>
                <p className="text-sm text-muted-foreground">
                  سيتم عرض الخريطة التفاعلية هنا
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Points List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.map((point) => (
            <Card key={point.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">{point.name}</CardTitle>
                  </div>
                  {point.verified && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="w-3 h-3 ms-1" />
                      موثق
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{point.governorate}</Badge>
                  <Badge variant="outline">{point.city}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>{point.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${point.phone}`} className="hover:text-primary">
                    {point.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span>{point.hours}</span>
                </div>
                <Button className="w-full" variant="outline">
                  <Navigation className="w-4 h-4 ms-2" />
                  الاتجاهات
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPoints.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد منافذ بيع</h3>
            <p className="text-muted-foreground">جرب تغيير البحث أو الفلتر</p>
          </div>
        )}

        {/* Contact Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>هل تريد أن تصبح منفذ بيع؟</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              انضم إلى شبكة منافذ البيع لدينا واحصل على فرصة لتوزيع منتجاتنا في منطقتك
            </p>
            <Button>
              <Store className="w-4 h-4 ms-2" />
              تقديم طلب
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

