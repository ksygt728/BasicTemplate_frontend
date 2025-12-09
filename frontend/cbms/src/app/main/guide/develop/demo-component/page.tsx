/**
 * @파일명 : page.tsx
 * @설명 : Linear Dark 테마 컴포넌트 데모 페이지
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Badge,
  Modal,
  Select,
  Alert,
  Table,
  AdvancedTable,
  SearchForm,
  ImageCard,
  Carousel,
  NavBar,
  Footer,
  Frame,
} from "@/components/common/themed";
import type {
  TableColumn,
  AdvancedTableColumn,
  SearchField,
  CarouselItem,
  NavMenuItem,
  FooterSection,
  FooterLink,
} from "@/components/common/themed";
import { theme } from "@/styles/theme";

export default function DemoComponentPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(true);
  const [showWarningAlert, setShowWarningAlert] = useState(true);
  const [showErrorAlert, setShowErrorAlert] = useState(true);
  const [showInfoAlert, setShowInfoAlert] = useState(true);

  const countryOptions = [
    { value: "kr", label: "대한민국" },
    { value: "us", label: "United States" },
    { value: "jp", label: "日本" },
    { value: "cn", label: "中国" },
    { value: "uk", label: "United Kingdom" },
    { value: "de", label: "Deutschland" },
    { value: "fr", label: "France" },
  ];

  const sizeOptions = [
    { value: "xs", label: "Extra Small" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra Large" },
    { value: "xxl", label: "2X Large", disabled: true },
  ];

  // Table data
  interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive" | "pending";
    createdAt: string;
  }

  const tableData: UserData[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "User",
      status: "inactive",
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Manager",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      status: "pending",
      createdAt: "2024-04-01",
    },
  ];

  const tableColumns: TableColumn<UserData>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: "80px",
      sortable: true,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortable: true,
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      width: "120px",
      align: "center",
      render: (value) => (
        <Badge
          variant={
            value === "Admin"
              ? "error"
              : value === "Manager"
              ? "warning"
              : "neutral"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      width: "120px",
      align: "center",
      render: (value) => (
        <Badge
          dot
          variant={
            value === "active"
              ? "success"
              : value === "inactive"
              ? "error"
              : "warning"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      dataIndex: "createdAt",
      width: "140px",
      sortable: true,
    },
    {
      key: "actions",
      title: "Actions",
      width: "120px",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: theme.spacing.xs,
            justifyContent: "center",
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Edit ${record.name}`);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Delete ${record.name}`);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // AdvancedTable용 데이터 (CRUD 지원)
  const [advancedTableData, setAdvancedTableData] = useState<UserData[]>([
    ...tableData,
  ]);

  const advancedTableColumns: AdvancedTableColumn<UserData>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: "80px",
      sortable: true,
      editable: false, // ID는 편집 불가
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortable: true,
      editable: true,
      required: true,
      type: "text",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
      editable: true,
      required: true,
      type: "email",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      width: "120px",
      align: "center",
      editable: true,
      type: "select",
      options: ["Admin", "Manager", "User"],
      render: (value) => (
        <Badge
          variant={
            value === "Admin"
              ? "error"
              : value === "Manager"
              ? "warning"
              : "neutral"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      width: "120px",
      align: "center",
      editable: true,
      type: "select",
      options: ["active", "inactive", "pending"],
      render: (value) => (
        <Badge
          dot
          variant={
            value === "active"
              ? "success"
              : value === "inactive"
              ? "error"
              : "warning"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      dataIndex: "createdAt",
      width: "140px",
      sortable: true,
      editable: true,
      type: "date",
    },
  ];

  // SearchForm 필드 정의
  const searchFields: SearchField[] = [
    {
      name: "name",
      label: "User Name",
      type: "text",
      placeholder: "Enter name...",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email...",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "admin", label: "Admin" },
        { value: "manager", label: "Manager" },
        { value: "user", label: "User" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      name: "createdDate",
      label: "Created Date",
      type: "dateRange",
    },
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    console.log("Search:", searchData);
    alert(`Search with: ${JSON.stringify(searchData, null, 2)}`);
  };

  const handleAdvancedTableAdd = async (record: UserData) => {
    console.log("Add:", record);
    const newRecord = { ...record, id: advancedTableData.length + 1 };
    setAdvancedTableData((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const handleAdvancedTableUpdate = async (id: React.Key, record: UserData) => {
    console.log("Update:", id, record);
    setAdvancedTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...record } : item))
    );
    return record;
  };

  const handleAdvancedTableDelete = async (id: React.Key) => {
    console.log("Delete:", id);
    setAdvancedTableData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdvancedTableBulkDelete = async (ids: React.Key[]) => {
    console.log("Bulk Delete:", ids);
    setAdvancedTableData((prev) =>
      prev.filter((item) => !ids.includes(item.id))
    );
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: theme.colors.background.default,
    color: theme.colors.text.primary,
    padding: theme.spacing.xxl,
    fontFamily: theme.typography.fontFamily,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xxl,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border.default}`,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  };

  const demoBoxStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.subtle,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    display: "block",
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length < 3) {
      setInputError("최소 3자 이상 입력해주세요");
    } else {
      setInputError("");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>Linear Dark Theme - Component Demo</h1>
        <p
          style={{
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.xxl,
          }}
        >
          재사용 가능한 테마 기반 컴포넌트 라이브러리
        </p>

        {/* Buttons Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Buttons</h2>

          <div style={demoBoxStyle}>
            <span style={labelStyle}>Variants</span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
              }}
            >
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="error">Error</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div style={{ ...demoBoxStyle, marginTop: theme.spacing.md }}>
            <span style={labelStyle}>Sizes</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div style={{ ...demoBoxStyle, marginTop: theme.spacing.md }}>
            <span style={labelStyle}>States & Icons</span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
              }}
            >
              <Button disabled>Disabled</Button>
              <Button loading={loading} onClick={handleLoadingDemo}>
                {loading ? "Loading..." : "Click to Load"}
              </Button>
              <Button leftIcon="🔍">Search</Button>
              <Button rightIcon="→">Next</Button>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Inputs</h2>

          <div style={gridStyle}>
            <Input label="Basic Input" placeholder="Enter text..." />
            <Input
              label="With Helper Text"
              placeholder="Username"
              helperText="Choose a unique username"
            />
            <Input
              label="With Error"
              placeholder="Email"
              error="Invalid email address"
              value={inputValue}
              onChange={handleInputChange}
            />
            <Input
              label="With Icons"
              placeholder="Search..."
              leftIcon="🔍"
              rightIcon="✕"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              leftIcon="🔒"
            />
            <Input label="Disabled" placeholder="Disabled input" disabled />
          </div>
        </section>

        {/* Badges Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Badges</h2>

          <div style={demoBoxStyle}>
            <span style={labelStyle}>Variants</span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
              }}
            >
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="neutral">Neutral</Badge>
            </div>
          </div>

          <div style={{ ...demoBoxStyle, marginTop: theme.spacing.md }}>
            <span style={labelStyle}>Sizes & Dots</span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
                alignItems: "center",
              }}
            >
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
              <Badge dot variant="success">
                Online
              </Badge>
              <Badge dot variant="error">
                Offline
              </Badge>
              <Badge dot variant="warning">
                Away
              </Badge>
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Cards</h2>

          <div style={gridStyle}>
            <Card title="Basic Card" subtitle="Simple card example">
              <p style={{ color: theme.colors.text.secondary }}>
                This is a basic card component with title and subtitle.
              </p>
            </Card>

            <Card
              title="Hoverable Card"
              subtitle="Try hovering over me"
              hoverable
            >
              <p style={{ color: theme.colors.text.secondary }}>
                This card has hover effects enabled.
              </p>
            </Card>

            <Card
              title="Card with Footer"
              footer={
                <div style={{ display: "flex", gap: theme.spacing.sm }}>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                  <Button size="sm">Confirm</Button>
                </div>
              }
            >
              <p style={{ color: theme.colors.text.secondary }}>
                This card includes a footer section with actions.
              </p>
            </Card>

            <Card
              title="Clickable Card"
              subtitle="Click me!"
              hoverable
              onClick={() => alert("Card clicked!")}
            >
              <p style={{ color: theme.colors.text.secondary }}>
                This card is clickable with an onClick handler.
              </p>
            </Card>
          </div>
        </section>

        {/* Select Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Select / Dropdown</h2>

          <div style={gridStyle}>
            <Select
              label="Country"
              placeholder="Select your country"
              options={countryOptions}
              value={selectedCountry}
              onChange={setSelectedCountry}
            />

            <Select
              label="Size"
              placeholder="Choose a size"
              options={sizeOptions}
              value={selectedSize}
              onChange={setSelectedSize}
            />

            <Select
              label="With Error"
              placeholder="Select..."
              options={countryOptions}
              error="This field is required"
            />

            <Select
              label="Disabled"
              placeholder="Cannot select"
              options={countryOptions}
              disabled
            />
          </div>

          <div style={{ ...demoBoxStyle, marginTop: theme.spacing.md }}>
            <span style={labelStyle}>Selected Values</span>
            <div
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                marginTop: theme.spacing.sm,
              }}
            >
              {selectedCountry && (
                <Badge variant="primary">
                  Country:{" "}
                  {
                    countryOptions.find((o) => o.value === selectedCountry)
                      ?.label
                  }
                </Badge>
              )}
              {selectedSize && (
                <Badge variant="info">
                  Size:{" "}
                  {sizeOptions.find((o) => o.value === selectedSize)?.label}
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* Alert Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Alerts</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.md,
            }}
          >
            {showSuccessAlert && (
              <Alert
                variant="success"
                title="Success"
                closable
                onClose={() => setShowSuccessAlert(false)}
              >
                Your changes have been saved successfully. All data has been
                updated.
              </Alert>
            )}

            {showWarningAlert && (
              <Alert
                variant="warning"
                title="Warning"
                closable
                onClose={() => setShowWarningAlert(false)}
              >
                Your session will expire in 5 minutes. Please save your work.
              </Alert>
            )}

            {showErrorAlert && (
              <Alert
                variant="error"
                title="Error"
                closable
                onClose={() => setShowErrorAlert(false)}
              >
                Failed to connect to the server. Please check your internet
                connection and try again.
              </Alert>
            )}

            {showInfoAlert && (
              <Alert
                variant="info"
                title="Information"
                closable
                onClose={() => setShowInfoAlert(false)}
              >
                New features are available! Check out the latest updates in the
                changelog.
              </Alert>
            )}

            <Alert variant="success">
              Simple success message without title
            </Alert>

            <Alert variant="info" icon="🎉">
              Alert with custom icon instead of default
            </Alert>
          </div>

          <div style={{ ...demoBoxStyle, marginTop: theme.spacing.md }}>
            <span style={labelStyle}>Reset Alerts</span>
            <div style={{ marginTop: theme.spacing.sm }}>
              <Button
                size="sm"
                onClick={() => {
                  setShowSuccessAlert(true);
                  setShowWarningAlert(true);
                  setShowErrorAlert(true);
                  setShowInfoAlert(true);
                }}
              >
                Show All Alerts
              </Button>
            </div>
          </div>
        </section>

        {/* Modal Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Modal</h2>

          <div style={demoBoxStyle}>
            <span style={labelStyle}>Modal Examples</span>
            <div
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                flexWrap: "wrap",
              }}
            >
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Demo Modal"
            size="md"
            footer={
              <>
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </>
            }
          >
            <p
              style={{
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              This is a demo modal using the Linear Dark theme. It includes a
              title, body content, and footer with action buttons.
            </p>
            <div style={{ marginTop: theme.spacing.md }}>
              <Input
                label="Sample Input"
                placeholder="Type something..."
                fullWidth
              />
            </div>
          </Modal>
        </section>

        {/* Table Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Table</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.md,
            }}
          >
            <Card
              title="User Management Table"
              subtitle="Sortable, hoverable, and interactive"
            >
              <Table
                columns={tableColumns}
                data={tableData}
                rowKey="id"
                hoverable
                onRowClick={(record) => alert(`Clicked row: ${record.name}`)}
              />
            </Card>

            <div style={gridStyle}>
              <Card title="Striped Table" subtitle="Alternate row colors">
                <Table
                  columns={tableColumns.slice(0, 4)}
                  data={tableData.slice(0, 3)}
                  striped
                  compact
                />
              </Card>

              <Card title="Borderless Table" subtitle="Clean minimal style">
                <Table
                  columns={tableColumns.slice(0, 4)}
                  data={tableData.slice(0, 3)}
                  bordered={false}
                  hoverable={false}
                />
              </Card>
            </div>

            <Card title="Empty State">
              <Table
                columns={tableColumns}
                data={[]}
                emptyText="No users found. Try adjusting your filters."
              />
            </Card>

            <Card title="Loading State">
              <Table columns={tableColumns} data={[]} loading />
            </Card>
          </div>
        </section>

        {/* ImageCard Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Image Cards</h2>

          <div style={gridStyle}>
            <Card title="Default Aspect Ratio (16:9)">
              <ImageCard
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt="Mountain landscape"
                title="Beautiful Mountains"
                description="Stunning mountain landscape with clear blue skies"
                aspectRatio="16:9"
              />
            </Card>

            <Card title="Square (1:1)">
              <ImageCard
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"
                alt="Forest"
                title="Forest Trail"
                description="Peaceful forest path"
                aspectRatio="1:1"
              />
            </Card>

            <Card title="With Badge">
              <ImageCard
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"
                alt="Nature"
                title="Nature Scene"
                description="Beautiful natural scenery"
                badge="Featured"
                aspectRatio="4:3"
              />
            </Card>

            <Card title="With Overlay">
              <ImageCard
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"
                alt="Lake"
                title="Mountain Lake"
                description="Serene lake with mountain backdrop"
                overlay
                aspectRatio="16:9"
              />
            </Card>

            <Card title="Clickable">
              <ImageCard
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800"
                alt="Sunset"
                title="Beach Sunset"
                description="Click to view more"
                onClick={() => alert("Image card clicked!")}
                aspectRatio="16:9"
              />
            </Card>
          </div>
        </section>

        {/* Carousel Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Carousel</h2>

          <div style={gridStyle}>
            <Card title="Auto-play Carousel">
              <Carousel
                items={[
                  {
                    id: 1,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200"
                          alt="Mountain Peaks"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Mountain Peaks
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Majestic mountain landscape
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 2,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200"
                          alt="Forest Path"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Forest Path
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Walk through nature
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 3,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200"
                          alt="Natural Beauty"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Natural Beauty
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Explore the wilderness
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 4,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200"
                          alt="Lake Reflection"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Lake Reflection
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Perfect mirror
                          </p>
                        </div>
                      </div>
                    ),
                  },
                ]}
                autoPlay
                interval={4000}
                showDots
                showArrows
                loop
              />
            </Card>

            <Card title="Manual Control">
              <Carousel
                items={[
                  {
                    id: 5,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200"
                          alt="Sunset Beach"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Sunset Beach
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Golden hour by the sea
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 6,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200"
                          alt="Ocean Waves"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Ocean Waves
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Coastal paradise
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 7,
                    content: (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "400px",
                        }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200"
                          alt="Sky View"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: theme.spacing.lg,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                            color: theme.colors.text.primary,
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Sky View
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              color: theme.colors.text.secondary,
                            }}
                          >
                            Above the clouds
                          </p>
                        </div>
                      </div>
                    ),
                  },
                ]}
                autoPlay={false}
                showDots
                showArrows
                loop
              />
            </Card>
          </div>
        </section>

        {/* NavBar Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Navigation Bar</h2>

          <Card title="Full Featured NavBar">
            <div style={{ marginBottom: theme.spacing.lg }}>
              <NavBar
                logo={<span style={{ fontWeight: 600 }}>MyApp</span>}
                menuItems={[
                  { id: "home", label: "Home", url: "/" },
                  {
                    id: "products",
                    label: "Products",
                    children: [
                      {
                        id: "all-products",
                        label: "All Products",
                        url: "/products",
                      },
                      {
                        id: "categories",
                        label: "Categories",
                        children: [
                          {
                            id: "electronics",
                            label: "Electronics",
                            url: "/products/electronics",
                          },
                          {
                            id: "clothing",
                            label: "Clothing",
                            url: "/products/clothing",
                          },
                          {
                            id: "books",
                            label: "Books",
                            url: "/products/books",
                          },
                        ],
                      },
                      {
                        id: "new",
                        label: "New Arrivals",
                        url: "/products/new",
                      },
                      { id: "sale", label: "Sale", url: "/products/sale" },
                    ],
                  },
                  {
                    id: "services",
                    label: "Services",
                    children: [
                      {
                        id: "consulting",
                        label: "Consulting",
                        url: "/services/consulting",
                      },
                      {
                        id: "support",
                        label: "Support",
                        url: "/services/support",
                      },
                      {
                        id: "training",
                        label: "Training",
                        url: "/services/training",
                      },
                    ],
                  },
                  { id: "about", label: "About", url: "/about" },
                  { id: "contact", label: "Contact", url: "/contact" },
                ]}
                user={{
                  name: "John Doe",
                  avatar: "https://i.pravatar.cc/150?img=12",
                }}
                onLogout={() => alert("Logged out")}
                breadcrumbs={[
                  { label: "Home", url: "/" },
                  { label: "Demo", url: "/demo-component" },
                  { label: "Components" },
                ]}
                onSearch={(query) => console.log("Search:", query)}
              />
            </div>
          </Card>

          <Card title="Simple NavBar (No User)">
            <NavBar
              logo={<span style={{ fontWeight: 600 }}>Brand</span>}
              menuItems={[
                { id: "home", label: "Home", url: "/" },
                { id: "features", label: "Features", url: "/features" },
                { id: "pricing", label: "Pricing", url: "/pricing" },
                { id: "contact", label: "Contact", url: "/contact" },
              ]}
              onSearch={(query) => console.log("Search:", query)}
            />
          </Card>
        </section>

        {/* Footer Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Footer</h2>

          <Card title="Full Featured Footer">
            <Footer
              logo={
                <span style={{ fontWeight: 600, fontSize: "18px" }}>
                  MyCompany
                </span>
              }
              companyName="MyCompany Inc."
              description="Building amazing products for the modern web. Quality, innovation, and customer satisfaction are our top priorities."
              sections={[
                {
                  title: "Products",
                  links: [
                    { label: "Features", url: "/features" },
                    { label: "Pricing", url: "/pricing" },
                    { label: "Security", url: "/security" },
                    { label: "Enterprise", url: "/enterprise" },
                  ],
                },
                {
                  title: "Company",
                  links: [
                    { label: "About Us", url: "/about" },
                    { label: "Careers", url: "/careers" },
                    { label: "Blog", url: "/blog" },
                    { label: "Press", url: "/press" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "Documentation", url: "/docs" },
                    { label: "Help Center", url: "/help" },
                    { label: "Community", url: "/community" },
                    { label: "Contact", url: "/contact" },
                  ],
                },
                {
                  title: "Legal",
                  links: [
                    { label: "Privacy Policy", url: "/privacy" },
                    { label: "Terms of Service", url: "/terms" },
                    { label: "Cookie Policy", url: "/cookies" },
                    { label: "GDPR", url: "/gdpr" },
                  ],
                },
              ]}
              socialLinks={[
                {
                  icon: <span>🐦</span>,
                  url: "https://twitter.com",
                  label: "Twitter",
                },
                {
                  icon: <span>📘</span>,
                  url: "https://facebook.com",
                  label: "Facebook",
                },
                {
                  icon: <span>💼</span>,
                  url: "https://linkedin.com",
                  label: "LinkedIn",
                },
                {
                  icon: <span>🐙</span>,
                  url: "https://github.com",
                  label: "GitHub",
                },
              ]}
              copyright="© 2025 MyCompany Inc. All rights reserved."
              bottomLinks={[
                { label: "Privacy", url: "/privacy" },
                { label: "Terms", url: "/terms" },
                { label: "Sitemap", url: "/sitemap" },
              ]}
            />
          </Card>
        </section>

        {/* Frame Components Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Frame Layouts</h2>

          <Card title="Basic Frame">
            <div style={{ height: "300px" }}>
              <Frame
                mode="basic"
                title="Basic Frame"
                description="A simple frame with title and description"
              >
                <div
                  style={{
                    padding: theme.spacing.md,
                    color: theme.colors.text.primary,
                  }}
                >
                  <p>This is the content area of the basic frame.</p>
                  <p>It can contain any React elements.</p>
                </div>
              </Frame>
            </div>
          </Card>

          <Card title="Split Frame (Resizable)">
            <div style={{ height: "400px" }}>
              <Frame
                mode="split"
                leftContent={
                  <div>
                    <h3
                      style={{
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Left Panel
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      This is the left panel content. Drag the divider to
                      resize.
                    </p>
                  </div>
                }
                rightContent={
                  <div>
                    <h3
                      style={{
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Right Panel
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      This is the right panel content. Try resizing the panels!
                    </p>
                  </div>
                }
                leftWidth="40%"
                resizable
              />
            </div>
          </Card>

          <Card title="Triple Split Frame (Resizable)">
            <div style={{ height: "600px" }}>
              <Frame
                mode="triple"
                leftContent={
                  <div>
                    <h3
                      style={{
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Left Panel
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      This is the left panel. You can resize both horizontally
                      and vertically.
                    </p>
                  </div>
                }
                rightTopContent={
                  <div>
                    <h3
                      style={{
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Right Top Panel
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      This is the top-right panel. Drag the horizontal divider
                      below to adjust height.
                    </p>
                  </div>
                }
                rightBottomContent={
                  <div>
                    <h3
                      style={{
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      Right Bottom Panel
                    </h3>
                    <p style={{ color: theme.colors.text.secondary }}>
                      This is the bottom-right panel. Drag the vertical divider
                      on the left to adjust the left panel width.
                    </p>
                  </div>
                }
                leftWidth="35%"
                rightTopHeight="60%"
                resizable
              />
            </div>
          </Card>
        </section>

        {/* Color Palette Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Color Palette</h2>

          <div style={gridStyle}>
            {Object.entries(theme.colors).map(([category, colors]) => (
              <Card
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.xs,
                  }}
                >
                  {Object.entries(colors).map(([name, color]) => (
                    <div
                      key={name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.sm,
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: color as string,
                          borderRadius: theme.borderRadius.sm,
                          border: `1px solid ${theme.colors.border.default}`,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: theme.colors.text.tertiary,
                        }}
                      >
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
