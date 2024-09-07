<% const filters = [
    { name: "ALL", icon: "fa-house", link: "/listings" },
    { name: "Trending", icon: "fa-fire", link: "/listings/category?q=Trending" },
    { name: "Rooms", icon: "fa-bed", link: "/listings/category?q=Rooms" },
    { name: "Top Cities", icon: "fa-mountain-city", link: "/listings/category?q=Top Cities" },
    { name: "Mountains", icon: "fa-mountain", link: "/listings/category?q=Mountains" },
    { name: "Castles", icon: "fa-fort-awesome", link: "/listings/category?q=Castles" },
    { name: "Amazing Pools", icon: "fa-person-swimming", link: "/listings/category?q=Amazing Pools" },
    { name: "Camping", icon: "fa-campground", link: "/listings/category?q=Camping" },
    { name: "Farms", icon: "fa-cow", link: "/listings/category?q=Farms" },
    { name: "Arctic", icon: "fa-snowflake", link: "/listings/category?q=Arctic" },
    { name: "Domes", icon: "fa-igloo", link: "/listings/category?q=Domes" },
    { name: "Beach", icon: "fa-umbrella-beach", link: "/listings/category?q=Beach" }
]; %>

<% filters.forEach(filter => { %>
<a class="nav-link" href="/listings/category?q=<%= filter.name %>">
    <div class="filter" style="opacity: <%= q === filter.name ? '1' : '0.7' %>;">
        <div><i class="fa-solid <%= filter.icon %> nav-icon"></i></div>
        <p><%= filter.name %></p>
        <div class="nav_line" style="opacity: <%= q === filter.name ? '1' : '0.3' %>;"></div>
    </div>
</a>
<% }); %>