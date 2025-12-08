"use client";

import { Button } from "@/components/common/themed/Button";
import { Card } from "@/components/common/themed/Card";
import { ImageCard } from "@/components/common/themed/ImageCard";
import { Carousel } from "@/components/common/themed/Carousel";
import type { CarouselItem } from "@/components/common/themed/Carousel";
import Link from "next/link";

export default function Home() {
  const heroImages: CarouselItem[] = [
    {
      id: 1,
      content: (
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920"
            alt="Digital Innovation"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
              display: "flex",
              alignItems: "center",
              padding: "0 80px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "#fff",
                }}
              >
                비즈니스 관리의 새로운 기준
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  marginBottom: "32px",
                  color: "#ddd",
                }}
              >
                CBMS로 효율적인 업무 환경을 경험하세요
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <Link href="/main">
                  <Button size="lg" variant="primary">
                    시작하기
                  </Button>
                </Link>
                <Link href="/demo-component">
                  <Button size="lg" variant="secondary">
                    데모 보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div style={{ position: "relative", width: "100%", height: "500px" }}>
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920"
            alt="Business Analytics"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
              display: "flex",
              alignItems: "center",
              padding: "0 80px",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "48px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  color: "#fff",
                }}
              >
                실시간 데이터 분석
              </h1>
              <p
                style={{
                  fontSize: "20px",
                  marginBottom: "32px",
                  color: "#ddd",
                }}
              >
                강력한 분석 도구로 비즈니스 인사이트를 얻으세요
              </p>
              <Link href="/main/admin/base/code">
                <Button size="lg" variant="primary">
                  더 알아보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ background: "var(--background-default)" }}>
      {/* Hero Carousel */}
      <Carousel
        items={heroImages}
        autoPlay
        interval={5000}
        showDots
        showArrows
        loop
      />

      {/* Features Section */}
      <section
        style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 600,
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            핵심 기능
          </h2>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
            비즈니스 성장을 위한 강력한 도구들
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          <Card hoverable>
            <div style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                데이터 관리
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                강력한 데이터 관리 기능으로 비즈니스 데이터를 체계적으로
                관리하세요
              </p>
            </div>
          </Card>

          <Card hoverable>
            <div style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔐</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                보안
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                JWT 기반 인증과 권한 관리로 안전한 시스템을 구축하세요
              </p>
            </div>
          </Card>

          <Card hoverable>
            <div style={{ textAlign: "center", padding: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  color: "var(--text-primary)",
                }}
              >
                빠른 성능
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                최신 기술 스택으로 구현된 빠르고 반응성 좋은 사용자 경험
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Showcase Section */}
      <section
        style={{
          padding: "80px 40px",
          background: "var(--background-subtle)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: 600,
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              다양한 산업 분야에서 활용
            </h2>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)" }}>
              여러 비즈니스 환경에 최적화된 솔루션
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            <ImageCard
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800"
              alt="Office"
              title="기업 관리"
              description="효율적인 기업 자원 관리"
              aspectRatio="16:9"
              overlay
            />
            <ImageCard
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"
              alt="Analytics"
              title="데이터 분석"
              description="실시간 비즈니스 인텔리전스"
              aspectRatio="16:9"
              overlay
            />
            <ImageCard
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800"
              alt="Team"
              title="팀 협업"
              description="원활한 팀 커뮤니케이션"
              aspectRatio="16:9"
              overlay
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 600,
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            지금 바로 시작하세요
          </h2>
          <p
            style={{
              fontSize: "18px",
              marginBottom: "32px",
              color: "var(--text-secondary)",
            }}
          >
            CBMS와 함께 비즈니스를 한 단계 성장시키세요
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/signUp">
              <Button size="lg" variant="primary">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/demo-component">
              <Button size="lg" variant="secondary">
                데모 체험하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
