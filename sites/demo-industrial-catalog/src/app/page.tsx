import Link from 'next/link';
import { ArrowRight, MagnifyingGlass, ClipboardText } from '@phosphor-icons/react/dist/ssr';
import { asset } from '@/lib/site';
import { categories, products } from '@/content/products';
import { ProductCard } from '@/components/product-card';
export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">INDUSTRIAL COMPONENTS</p>
            <h1>
              按型号找产品，
              <br />
              按参数选配件。
            </h1>
            <p className="hero-sub">轴承 · 紧固件 · 传动配件</p>
            <form
              action={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/products/`}
              className="search"
            >
              <MagnifyingGlass size={24} />
              <input aria-label="搜索产品" name="q" placeholder="输入型号、产品名称或规格" />
              <button type="submit" aria-label="搜索产品">
                <span>搜索产品</span>
                <MagnifyingGlass className="mobile-icon" size={24} />
              </button>
            </form>
          </div>
          <picture className="hero-media">
            <source media="(max-width:700px)" srcSet={asset('images/hero-mobile.webp')} />
            <img
              className="hero-image"
              src={asset('images/hero.webp')}
              alt="轴承、紧固件与联轴器品类示意"
              width="1000"
              height="620"
              fetchPriority="high"
            />
          </picture>
        </div>
      </section>
      <section className="container section home-categories">
        <div className="section-title">
          <h2>按品类浏览</h2>
          <span />
          <Link href="/products/">
            查看全部产品 <ArrowRight />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link className="category" href={`/products/?category=${c.id}`} key={c.id}>
              <div>
                <h3>{c.name}</h3>
                <p className="eyebrow">{c.en}</p>
                <small>{c.description}</small>
              </div>
              <img
                src={asset(`images/${c.image}.webp`)}
                alt={`${c.name}品类示意`}
                width="230"
                height="230"
              />
            </Link>
          ))}
          <Link className="category mobile-support" href="/support/">
            <div>
              <h3>选型支持</h3>
              <small>
                按型号、参数
                <br />
                快速选型
              </small>
            </div>
            <ClipboardText size={58} />
          </Link>
        </div>
      </section>
      <section className="container section popular">
        <div className="section-title">
          <h2>常用产品</h2>
          <span />
        </div>
        <div className="popular-grid">
          {[products[0], products[4], products[8]].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="container section purchase">
        <p className="eyebrow">PROCUREMENT SUPPORT</p>
        <h2>把零散需求，整理成清晰的清单。</h2>
        <p>记录关注的产品与数量，带着完整信息开始沟通。</p>
        <Link className="button outline" href="/support/">
          查看采购支持 <ArrowRight />
        </Link>
      </section>
    </main>
  );
}
