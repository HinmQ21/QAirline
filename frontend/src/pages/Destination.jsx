import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, Users, Calendar, Filter,
  Globe, ArrowRight, Heart, Camera,
  Plane, TrendingUp, Sun, Mountain, Waves, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { css } from '@/css/styles';

// Mock data for destinations
const destinationsData = [
  {
    id: 1,
    name: 'Paris',
    country: 'Pháp',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=500&h=300&fit=crop',
    price: '$899',
    rating: 4.8,
    reviews: 2547,
    category: 'Lãng mạn',
    description: 'Thành phố ánh sáng chào đón bạn với những địa danh biểu tượng, ẩm thực đẳng cấp thế giới và bầu không khí lãng mạn.',
    highlights: ['Tháp Eiffel', 'Bảo tàng Louvre', 'Du thuyền sông Seine'],
    bestTime: 'Tháng 4-10',
    duration: '5-7 ngày',
    isPopular: true,
    isTrending: false
  },
  {
    id: 2,
    name: 'Tokyo',
    country: 'Nhật Bản',
    continent: 'Châu Á',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop',
    price: '$1,299',
    rating: 4.9,
    reviews: 3421,
    category: 'Văn hóa',
    description: 'Trải nghiệm sự kết hợp hoàn hảo giữa văn hóa truyền thống và công nghệ hiện đại.',
    highlights: ['Ngã tư Shibuya', 'Núi Phú Sĩ', 'Đền chùa truyền thống'],
    bestTime: 'Tháng 3-5',
    duration: '7-10 ngày',
    isPopular: true,
    isTrending: true
  },
  {
    id: 3,
    name: 'Santorini',
    country: 'Hy Lạp',
    continent: 'Châu Âu',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=300&fit=crop',
    price: '$1,199',
    rating: 4.7,
    reviews: 1876,
    category: 'Biển',
    description: 'Hoàng hôn tuyệt đẹp, những tòa nhà trắng và làn nước trong vắt đang chờ đón bạn.',
    highlights: ['Hoàng hôn Oia', 'Mái vòm xanh', 'Bãi biển núi lửa'],
    bestTime: 'Tháng 5-9',
    duration: '4-6 ngày',
    isPopular: false,
    isTrending: true
  },
  {
    id: 4,
    name: 'New York',
    country: 'Hoa Kỳ',
    continent: 'Bắc Mỹ',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop',
    price: '$1,099',
    rating: 4.6,
    reviews: 4532,
    category: 'Thành phố',
    description: 'Thành phố không bao giờ ngủ với vô số giải trí và những địa danh biểu tượng.',
    highlights: ['Tượng Nữ thần Tự do', 'Công viên Trung tâm', 'Show Broadway'],
    bestTime: 'Tháng 4-6',
    duration: '4-7 ngày',
    isPopular: true,
    isTrending: false
  },
  {
    id: 5,
    name: 'Bali',
    country: 'Indonesia',
    continent: 'Châu Á',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop',
    price: '$799',
    rating: 4.8,
    reviews: 2891,
    category: 'Biển',
    description: 'Thiên đường nhiệt đới với những bãi biển đẹp, đền cổ và văn hóa sôi động.',
    highlights: ['Ruộng bậc thang', 'Câu lạc bộ bãi biển', 'Đền Hindu'],
    bestTime: 'Tháng 4-10',
    duration: '7-14 ngày',
    isPopular: true,
    isTrending: true
  },
  {
    id: 6,
    name: 'Dubai',
    country: 'UAE',
    continent: 'Châu Á',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=300&fit=crop',
    price: '$1,399',
    rating: 4.5,
    reviews: 1654,
    category: 'Sang trọng',
    description: 'Thành phố siêu hiện đại với mua sắm xa xỉ, kiến trúc ấn tượng và những cuộc phiêu lưu sa mạc.',
    highlights: ['Tòa tháp Burj Khalifa', 'Safari sa mạc', 'Trung tâm mua sắm sang trọng'],
    bestTime: 'Tháng 11-3',
    duration: '3-5 ngày',
    isPopular: false,
    isTrending: true
  }
];

const categories = [
  { name: 'Tất cả', icon: Globe, color: 'bg-gray-100 text-gray-700' },
  { name: 'Biển', icon: Waves, color: 'bg-blue-100 text-blue-700' },
  { name: 'Thành phố', icon: Building, color: 'bg-purple-100 text-purple-700' },
  { name: 'Văn hóa', icon: Camera, color: 'bg-green-100 text-green-700' },
  { name: 'Lãng mạn', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  { name: 'Sang trọng', icon: Star, color: 'bg-yellow-100 text-yellow-700' }
];

const DestinationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedContinent, setSelectedContinent] = useState('Tất cả');
  const [filteredDestinations, setFilteredDestinations] = useState(destinationsData);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const continents = ['Tất cả', 'Châu Âu', 'Châu Á', 'Bắc Mỹ', 'Nam Mỹ', 'Châu Phi', 'Châu Đại Dương'];

  useEffect(() => {
    let filtered = destinationsData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Continent filter
    if (selectedContinent !== 'Tất cả') {
      filtered = filtered.filter(dest => dest.continent === selectedContinent);
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, selectedCategory, selectedContinent]);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const DestinationCard = ({ destination }) => (
    <div className="group bg-white w-[360px] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
      <div className="relative">
        <img 
          src={destination.image} 
          alt={destination.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {destination.isPopular && (
            <Badge className="bg-red-500 text-white border-none">
              <Star className="w-3 h-3 mr-1" />
              Phổ biến
            </Badge>
          )}
          {destination.isTrending && (
            <Badge className="bg-green-500 text-white border-none">
              <TrendingUp className="w-3 h-3 mr-1" />
              Xu hướng
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button 
          onClick={() => toggleFavorite(destination.id)}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${favorites.has(destination.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Price tag */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Từ {destination.price}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{destination.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {destination.country}, {destination.continent}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="font-semibold">{destination.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{destination.reviews} đánh giá</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {destination.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-1" />
              Thời gian tốt nhất: {destination.bestTime}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {destination.duration}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {destination.highlights.slice(0, 2).map((highlight, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {highlight}
              </Badge>
            ))}
            {destination.highlights.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{destination.highlights.length - 2} điểm khác
              </Badge>
            )}
          </div>
        </div>

        <Button 
          onClick={() => {
            navigate('/flights');
          }}
          className="w-full bg-gradient-to-r from-gray-900 to-pink-950 hover:from-gray-800 hover:to-pink-900 text-white"
        >
          <Plane className="w-4 h-4 mr-2" />
          Đặt chuyến bay
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-x-clip">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Khám phá những <span className="text-pink-300">Điểm đến</span> tuyệt vời
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Khám phá những địa điểm đẹp nhất thế giới và tạo nên những kỷ niệm khó quên
            </p>
            
            {/* Search bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm điểm đến, quốc gia hoặc trải nghiệm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-12 pr-4 py-4 text-lg bg-white text-gray-900
                    rounded-2xl border border-gray-200 focus:ring-4
                    focus:ring-pink-300/50 focus:outline-none
                    focus:border-pink-300 shadow-xl transition-all duration-200
                  "
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="-mt-8 relative z-20">
        <div className="my-10">
          {/* Filters Section */}
          <div className={`${css.minipagemx} ${css.minipage.lg} p-6 mb-8`}>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className={`text-2xl font-bold ${css.homepageGgGradient} bg-clip-text text-transparent`}>
                Khám phá theo danh mục
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </Button>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.name;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-gray-900 to-pink-950 text-white shadow-lg transform scale-105' 
                        : `${category.color} hover:scale-105 hover:shadow-md`
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Continent filter */}
            <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lọc theo châu lục</h3>
              <div className="flex flex-wrap gap-2">
                {continents.map((continent) => (
                  <button
                    key={continent}
                    onClick={() => setSelectedContinent(continent)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedContinent === continent
                        ? 'bg-gray-800 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results summary */}
          <div className={`${css.minipagemx} ${css.minipage.lg} mb-6 p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Tìm thấy {filteredDestinations.length} điểm đến
                </h3>
                <p className="text-gray-600 text-sm">
                  {searchTerm && `Hiển thị kết quả cho "${searchTerm}"`}
                  {selectedCategory !== 'Tất cả' && ` trong danh mục ${selectedCategory}`}
                  {selectedContinent !== 'Tất cả' && ` tại ${selectedContinent}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <Globe className="w-3 h-3 mr-1" />
                  {filteredDestinations.filter(d => d.isPopular).length} Phổ biến
                </Badge>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {filteredDestinations.filter(d => d.isTrending).length} Xu hướng
                </Badge>
              </div>
            </div>
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length > 0 ? (
            <div className="flex flex-wrap gap-4 justify-center mx-12">
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          ) : (
            <div className={`${css.minipagemx} ${css.minipage.lg} text-center py-20`}>
              <div className="max-w-md mx-auto">
                <Globe className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Không tìm thấy điểm đến nào
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Chúng tôi không tìm thấy điểm đến nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Tất cả');
                    setSelectedContinent('Tất cả');
                  }}
                  className="bg-gradient-to-r from-gray-900 to-pink-950 hover:from-gray-800 hover:to-pink-900 text-white"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Hiển thị tất cả điểm đến
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
